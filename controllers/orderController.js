
const { db } = require('../config/db');

const {
    createOrderNotification
} = require("./notificationController");

const {
    createUserOrderNotification
} = require("./notificationUserController");


// ========================================
// TỰ ĐỘNG CẬP NHẬT HẠNG THÀNH VIÊN
// ========================================

const updateMembershipRank = async (userId) => {

    // KIỂM TRA QUYỀN CỦA TÀI KHOẢN
    const [userResult] = await db.query(`
        SELECT role
        FROM users
        WHERE id = ?
    `, [userId]);

    if (userResult.length === 0) {
        return;
    }

    const role = userResult[0].role;

    // ADMIN KHÔNG CÓ HẠNG THÀNH VIÊN
    if (role && role.toLowerCase() === 'admin') {

        await db.query(`
            UPDATE users
            SET membership_rank = NULL
            WHERE id = ?
        `, [userId]);

        return;
    }

    // TÍNH SỐ ĐƠN HOÀN THÀNH
    const [result] = await db.query(`
        SELECT COUNT(*) AS completedOrders
        FROM Orders
        WHERE user_id = ?
        AND status = 'Hoàn thành'
    `, [userId]);

    const completedOrders = Number(result[0].completedOrders || 0);

    // XẾP HẠNG
    let membershipRank = 'Hạng Đồng';

    if (completedOrders >= 20) {
        membershipRank = 'Hạng Kim Cương';
    }
    else if (completedOrders >= 15) {
        membershipRank = 'Hạng Vàng';
    }
    else if (completedOrders >= 10) {
        membershipRank = 'Hạng Bạc';
    }
    else {
        membershipRank = 'Hạng Đồng';
    }

    // LƯU HẠNG
    await db.query(`
        UPDATE users
        SET membership_rank = ?
        WHERE id = ?
    `, [membershipRank, userId]);

};


const syncMembershipRank = async (req, res) => {

    try {

        if (!req.session.user) {
            return res.status(401).send("Chưa đăng nhập");
        }

        const userId = req.session.user.id;

        await updateMembershipRank(userId);

        res.send("ok");

    } catch (error) {

        res.status(500).send(error.message);

    }

};


// ========================================
// TẠO ĐƠN HÀNG
// ========================================

const createOrder = async (req, res) => {

    try {

        const {
            user_id,
            ho,
            ten,
            email,
            phone,
            address,
            city,
            district,
            note,
            payment_method,
            shipping_method,
            shipping_fee,
            subtotal,
            discount,
            voucher_code,
            total
        } = req.body;


        // ========================================
        // LẤY SẢN PHẨM CẦN MUA
        // ========================================

        let orderProducts = [];

        if (req.session.buyNow) {

            const buyNow = req.session.buyNow;

            const [productResult] = await db.query(`
                SELECT
                    product_id,
                    product_name,
                    stock_quantity
                FROM products
                WHERE product_name = ?
            `, [buyNow.product_name]);

            if (productResult.length === 0) {

                return res.status(404).send(
                    "Không tìm thấy sản phẩm"
                );

            }

            orderProducts.push({
                product_id: productResult[0].product_id,
                product_name: productResult[0].product_name,
                quantity: Number(buyNow.quantity) || 1,
                stock_quantity: Number(productResult[0].stock_quantity) || 0
            });

        }

        else {

            const [cartResult] = await db.query(`
                SELECT
                    Cart.cart_id,
                    Cart.product_name,
                    Cart.quantity,
                    Cart.image,
                    Cart.price,
                    Cart.price_old,
                    Cart.size,
                    products.product_id,
                    products.stock_quantity
                FROM Cart
                INNER JOIN products
                    ON Cart.product_name = products.product_name
                WHERE Cart.user_id = ?
                AND Cart.order_id IS NULL
                ORDER BY Cart.cart_id ASC
            `, [user_id]);

            if (cartResult.length === 0) {

                return res.status(400).send(
                    "Giỏ hàng đang trống"
                );

            }

            orderProducts = cartResult.map(function (item) {

                return {
                    cart_id: item.cart_id,
                    product_id: item.product_id,
                    product_name: item.product_name,
                    quantity: Number(item.quantity) || 1,
                    stock_quantity: Number(item.stock_quantity) || 0
                };

            });

        }


        // ========================================
        // LƯU ĐƠN HÀNG
        // ========================================

        const [result] = await db.query(`
            INSERT INTO Orders (
                user_id,
                ho,
                ten,
                email,
                phone,
                address,
                city,
                district,
                note,
                payment_method,
                shipping_method,
                shipping_fee,
                subtotal,
                discount,
                voucher_code,
                total,
                payment_status,
                created_at,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
        `, [
            user_id,
            ho,
            ten,
            email,
            phone,
            address,
            city,
            district,
            note || null,
            payment_method,
            shipping_method,
            shipping_fee,
            subtotal,
            discount,
            voucher_code || null,
            total,
            'Chưa thanh toán',
            'Chờ xử lý'
        ]);

        // LẤY ID ĐƠN HÀNG VỪA TẠO
        const order_id = result.insertId;


        // ========================================
        // TRỪ TỒN KHO
        // ========================================

        for (const item of orderProducts) {

            await db.query(`
                UPDATE products
                SET stock_quantity = stock_quantity - ?
                WHERE product_id = ?
            `, [
                item.quantity,
                item.product_id
            ]);

        }


        // ========================================
        // XỬ LÝ GIỎ HÀNG / MUA NGAY
        // ========================================

        if (req.session.buyNow) {

            // MUA NGAY

            const buyNow = req.session.buyNow;

            await db.query(`
                INSERT INTO Cart (
                    user_id,
                    product_name,
                    quantity,
                    image,
                    price,
                    price_old,
                    size,
                    order_id
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                user_id,
                buyNow.product_name,
                buyNow.quantity,
                buyNow.image,
                buyNow.price,
                buyNow.price_old,
                buyNow.size,
                order_id
            ]);

            // XÓA MUA NGAY KHỎI SESSION
            delete req.session.buyNow;

        }

        else {

            // MUA TỪ GIỎ HÀNG

            await db.query(`
                UPDATE Cart
                SET order_id = ?
                WHERE user_id = ?
                AND order_id IS NULL
            `, [
                order_id,
                user_id
            ]);

        }


        // ========================================
        // TẠO THÔNG BÁO CHO ADMIN
        // ========================================

        await createOrderNotification({
            order_id: order_id,
            user_id: user_id,
            ho: ho,
            ten: ten,
            total: total
        });


        // ========================================
        // TRẢ ORDER_ID CHO FRONTEND
        // ========================================

        res.json({
            order_id: order_id
        });


    } catch (error) {

        res.status(500).send(
            error.message
        );

    }

};


// ========================================
// LẤY THÔNG TIN ĐƠN HÀNG
// ========================================

const getOrderById = async (req, res) => {

    try {

        const { order_id } = req.params;

        const [result] = await db.query(`
            SELECT
                order_id,
                user_id,
                ho,
                ten,
                email,
                phone,
                address,
                city,
                district,
                note,
                shipping_method,
                shipping_fee,
                subtotal,
                discount,
                voucher_code,
                payment_method,
                DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
                total,
                status
            FROM Orders
            WHERE order_id = ?
        `, [order_id]);

        res.json(result);

    } catch (error) {

        res.status(500).send(
            error.message
        );

    }

};


// ========================================
// LẤY TẤT CẢ ĐƠN HÀNG - ADMIN
// ========================================

const getAllOrders = async (req, res) => {

    try {

        const [result] = await db.query(`
            SELECT
                Orders.order_id,
                Orders.ho,
                Orders.ten,
                GROUP_CONCAT(
                    Cart.product_name
                    SEPARATOR ', '
                ) AS product_name,
                Orders.total,
                Orders.created_at AS order_date,
                Orders.status
            FROM Orders
            LEFT JOIN Cart
                ON Orders.order_id = Cart.order_id
            GROUP BY
                Orders.order_id,
                Orders.ho,
                Orders.ten,
                Orders.total,
                Orders.created_at,
                Orders.status
            ORDER BY
                Orders.created_at DESC
        `);

        res.json(result);

    } catch (error) {

        res.status(500).send(
            error.message
        );

    }

};


// ========================================
// LẤY SẢN PHẨM TRONG ĐƠN HÀNG
// ========================================

const getOrderProducts = async (req, res) => {

    try {

        const { order_id } = req.params;

        const [result] = await db.query(`
            SELECT
                Cart.cart_id,
                Cart.product_name,
                Cart.quantity,
                Cart.image,
                Cart.price,
                Cart.price_old,
                Cart.size,
                Cart.discount,
                Orders.order_id
            FROM Cart
            INNER JOIN Orders
                ON Cart.order_id = Orders.order_id
            WHERE Cart.order_id = ?
            ORDER BY Cart.cart_id ASC
        `, [order_id]);

        res.json(result);

    } catch (error) {

        res.status(500).send(
            error.message
        );

    }

};


// ========================================
// LẤY LỊCH SỬ ĐẶT HÀNG
// ========================================

const getOrderHistory = async (req, res) => {

    try {

        const { user_id } = req.params;

        const [result] = await db.query(`
            SELECT
                order_id,
                user_id,
                ho,
                ten,
                email,
                phone,
                address,
                city,
                district,
                payment_method,
                created_at,
                shipping_method,
                shipping_fee,
                subtotal,
                discount,
                voucher_code,
                total,
                status,
                note
            FROM Orders
            WHERE user_id = ?
            ORDER BY created_at DESC
        `, [user_id]);

        res.json(result);

    } catch (error) {

        res.status(500).send(
            error.message
        );

    }

};


// ========================================
// HỦY ĐƠN HÀNG
// ========================================

const cancelOrder = async (req, res) => {

    try {

        const { order_id } = req.params;


        // LẤY USER_ID
        const [result] = await db.query(`
            SELECT user_id
            FROM Orders
            WHERE order_id = ?
            AND status = ?
        `, [
            order_id,
            'Chờ xử lý'
        ]);


        if (result.length === 0) {

            return res.status(404).send(
                "Không thể hủy đơn hàng"
            );

        }


        const userId = result[0].user_id;


        // CẬP NHẬT TRẠNG THÁI
        await db.query(`
            UPDATE Orders
            SET status = ?
            WHERE order_id = ?
            AND status = ?
        `, [
            'Đã hủy',
            order_id,
            'Chờ xử lý'
        ]);


        // TẠO THÔNG BÁO
        await createUserOrderNotification(
            userId,
            order_id,
            "Đã hủy"
        );


        res.send("ok");


    } catch (error) {

        res.status(500).send(
            error.message
        );

    }

};


// ========================================
// CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG - ADMIN
// ========================================

const updateOrderStatus = async (req, res) => {

    try {

        const orderId = Number(req.params.order_id);

        const status = req.body.status;


        // KIỂM TRA ID
        if (!orderId) {

            return res.status(400).send(
                "ID đơn hàng không hợp lệ"
            );

        }


        // KIỂM TRA TRẠNG THÁI
        if (!status) {

            return res.status(400).send(
                "Trạng thái không hợp lệ"
            );

        }


        // LẤY USER_ID
        const [orderResult] = await db.query(`
            SELECT user_id
            FROM Orders
            WHERE order_id = ?
        `, [orderId]);


        if (orderResult.length === 0) {

            return res.status(404).send(
                "Không tìm thấy đơn hàng"
            );

        }


        const userId = orderResult[0].user_id;


        // CẬP NHẬT TRẠNG THÁI
        await db.query(`
            UPDATE Orders
            SET status = ?
            WHERE order_id = ?
        `, [
            status,
            orderId
        ]);


        await updateMembershipRank(userId);


        // TẠO THÔNG BÁO CHO USER
        await createUserOrderNotification(
            userId,
            orderId,
            status
        );


        res.send("ok");


    } catch (error) {

        res.status(500).send(
            error.message
        );

    }

};


// ========================================
// XÓA ĐƠN HÀNG
// ========================================

const deleteOrder = async (req, res) => {

    try {

        const { order_id } = req.params;


        // XÓA SẢN PHẨM TRONG CART TRƯỚC
        await db.query(`
            DELETE FROM Cart
            WHERE order_id = ?
        `, [order_id]);


        // XÓA ĐƠN HÀNG
        await db.query(`
            DELETE FROM Orders
            WHERE order_id = ?
        `, [order_id]);


        res.send("ok");


    } catch (error) {

        res.status(500).send(
            error.message
        );

    }

};


// ========================================
// TỔNG QUAN MUA HÀNG
// ========================================

const getOrderOverview = async (req, res) => {

    try {

        if (!req.session.user) {

            return res.status(401).send(
                "Chưa đăng nhập"
            );

        }


        const userId = req.session.user.id;


        // CẬP NHẬT HẠNG THÀNH VIÊN
        await updateMembershipRank(userId);


        // LẤY TỔNG QUAN
        const [result] = await db.query(`
            SELECT
                (
                    SELECT COUNT(*)
                    FROM Orders
                    WHERE user_id = ?
                ) AS totalOrders,

                (
                    SELECT COUNT(*)
                    FROM Orders
                    WHERE user_id = ?
                    AND status = 'Hoàn thành'
                ) AS completedOrders,

                (
                    SELECT IFNULL(SUM(Cart.quantity), 0)
                    FROM Cart
                    INNER JOIN Orders
                        ON Cart.order_id = Orders.order_id
                    WHERE Orders.user_id = ?
                    AND Orders.status = 'Hoàn thành'
                ) AS totalProducts,

                (
                    SELECT IFNULL(SUM(total), 0)
                    FROM Orders
                    WHERE user_id = ?
                    AND status = 'Hoàn thành'
                ) AS totalMoney,

                (
                    SELECT membership_rank
                    FROM users
                    WHERE id = ?
                ) AS membershipRank,

                (
                    SELECT role
                    FROM users
                    WHERE id = ?
                ) AS role
        `, [
            userId,
            userId,
            userId,
            userId,
            userId,
            userId
        ]);


        res.json(result[0]);


    } catch (error) {

        res.status(500).send(
            error.message
        );

    }

};


// ========================================
// EXPORT
// ========================================

module.exports = {

    createOrder,
    getOrderById,
    getOrderProducts,
    getOrderHistory,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    getOrderOverview,
    updateMembershipRank,
    syncMembershipRank

};
