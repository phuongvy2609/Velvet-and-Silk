const { sql } = require('../config/db');

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

    // ========================================
    // KIỂM TRA QUYỀN CỦA TÀI KHOẢN
    // ========================================

    const userResult = await sql.query`

        SELECT role

        FROM users

        WHERE id = ${userId}

    `;

    if (userResult.recordset.length === 0) {
        return;
    }

    const role = userResult.recordset[0].role;

    // ========================================
    // ADMIN KHÔNG CÓ HẠNG THÀNH VIÊN
    // ========================================

    if (role && role.toLowerCase() === 'admin') {

        await sql.query`

            UPDATE users

            SET membership_rank = NULL

            WHERE id = ${userId}

        `;

        return;
    }

    // ========================================
    // TÍNH SỐ ĐƠN HOÀN THÀNH CỦA USER
    // ========================================

    const result = await sql.query`

        SELECT COUNT(*) AS completedOrders

        FROM Orders

        WHERE user_id = ${userId}

        AND status = N'Hoàn thành'

    `;

    const completedOrders =
        Number(
            result.recordset[0].completedOrders || 0
        );

    // ========================================
    // XẾP HẠNG
    // ========================================

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

    // ========================================
    // LƯU HẠNG
    // ========================================

    await sql.query`

        UPDATE users

        SET membership_rank = ${membershipRank}

        WHERE id = ${userId}

    `;

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

            const productResult = await sql.query`

                SELECT
                    product_id,
                    product_name,
                    stock_quantity

                FROM products

                WHERE product_name = ${buyNow.product_name}

            `;

            if (productResult.recordset.length === 0) {

                return res.status(404).send(
                    "Không tìm thấy sản phẩm"
                );

            }

            orderProducts.push({
                product_id: productResult.recordset[0].product_id,
                product_name: productResult.recordset[0].product_name,
                quantity: Number(buyNow.quantity) || 1,
                stock_quantity: Number(productResult.recordset[0].stock_quantity) || 0
            });

        }

        else {

            const cartResult = await sql.query`

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

                WHERE Cart.user_id = ${user_id}

                AND Cart.order_id IS NULL

                ORDER BY Cart.cart_id ASC

            `;

            if (cartResult.recordset.length === 0) {

                return res.status(400).send(
                    "Giỏ hàng đang trống"
                );

            }

            orderProducts = cartResult.recordset.map(function (item) {

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

        const result = await sql.query`

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
                total
            )

            OUTPUT INSERTED.order_id

            VALUES (
                ${user_id},
                ${ho},
                ${ten},
                ${email},
                ${phone},
                ${address},
                ${city},
                ${district},
                ${note || null},
                ${payment_method},
                ${shipping_method},
                ${shipping_fee},
                ${subtotal},
                ${discount},
                ${voucher_code || null},
                ${total}
            )

        `;
        // TRỪ TỒN KHO
        
          for (const item of orderProducts) {

            await sql.query`
                UPDATE products
                SET stock_quantity = stock_quantity - ${item.quantity}
                WHERE product_id = ${item.product_id}
            `;

        }


        const order_id =
            result.recordset[0].order_id;



        // ========================================
        // XỬ LÝ GIỎ HÀNG / MUA NGAY
        // ========================================

        if (req.session.buyNow) {

            // MUA NGAY

            const buyNow =
                req.session.buyNow;


            await sql.query`

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

                VALUES (
                    ${user_id},
                    ${buyNow.product_name},
                    ${buyNow.quantity},
                    ${buyNow.image},
                    ${buyNow.price},
                    ${buyNow.price_old},
                    ${buyNow.size},
                    ${order_id}
                )

            `;


            // Xóa mua ngay khỏi session

            delete req.session.buyNow;

        }

        else {

            // MUA TỪ GIỎ HÀNG

            await sql.query`

                UPDATE Cart

                SET order_id = ${order_id}

                WHERE user_id = ${user_id}

                AND order_id IS NULL

            `;

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

        const {
            order_id
        } = req.params;


        const result = await sql.query`

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
                created_at,
                total,
                status

            FROM Orders

            WHERE order_id = ${order_id}

        `;


        res.json(
            result.recordset
        );


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

        const result = await sql.query`

            SELECT
                Orders.order_id,
                Orders.ho,
                Orders.ten,

                STRING_AGG(
                    Cart.product_name,
                    N', '
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

        `;


        res.json(
            result.recordset
        );


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

        const {
            order_id
        } = req.params;


        const result = await sql.query`

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

            WHERE Cart.order_id = ${order_id}

            ORDER BY Cart.cart_id ASC

        `;


        res.json(
            result.recordset
        );


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

        const {
            user_id
        } = req.params;


        const result = await sql.query`

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

            WHERE user_id = ${user_id}

            ORDER BY created_at DESC

        `;


        res.json(
            result.recordset
        );


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

        const {
            order_id
        } = req.params;


        // ========================================
        // LẤY USER_ID
        // ========================================

        const result = await sql.query`

            SELECT
                user_id

            FROM Orders

            WHERE order_id = ${order_id}

            AND status = N'Chờ xử lý'

        `;


        if (
            result.recordset.length === 0
        ) {

            return res.status(404).send(
                "Không thể hủy đơn hàng"
            );

        }


        const userId =
            result.recordset[0].user_id;



        // ========================================
        // CẬP NHẬT TRẠNG THÁI
        // ========================================

        await sql.query`

            UPDATE Orders

            SET status = N'Đã hủy'

            WHERE order_id = ${order_id}

            AND status = N'Chờ xử lý'

        `;



        // ========================================
        // TẠO THÔNG BÁO
        // ========================================

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

        const orderId =
            Number(req.params.order_id);

        const status =
            req.body.status;



        // ========================================
        // KIỂM TRA ID
        // ========================================

        if (!orderId) {

            return res.status(400).send(
                "ID đơn hàng không hợp lệ"
            );

        }



        // ========================================
        // KIỂM TRA TRẠNG THÁI
        // ========================================

        if (!status) {

            return res.status(400).send(
                "Trạng thái không hợp lệ"
            );

        }



        // ========================================
        // LẤY USER_ID
        // ========================================

        const orderResult = await sql.query`

            SELECT
                user_id

            FROM Orders

            WHERE order_id = ${orderId}

        `;


        if (
            orderResult.recordset.length === 0
        ) {

            return res.status(404).send(
                "Không tìm thấy đơn hàng"
            );

        }


        const userId =
            orderResult.recordset[0].user_id;



        // ========================================
        // CẬP NHẬT TRẠNG THÁI
        // ========================================

        await sql.query`

            UPDATE Orders

            SET status = ${status}

            WHERE order_id = ${orderId}

        `;

        await updateMembershipRank(userId);

        // ========================================
        // TẠO THÔNG BÁO CHO USER
        // ========================================

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

        const {
            order_id
        } = req.params;


        // Xóa sản phẩm trong Cart trước

        await sql.query`

            DELETE FROM Cart

            WHERE order_id = ${order_id}

        `;


        // Xóa đơn hàng

        await sql.query`

            DELETE FROM Orders

            WHERE order_id = ${order_id}

        `;


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

        const userId =
            req.session.user.id;


        // ========================================
        // CẬP NHẬT HẠNG THÀNH VIÊN
        // ========================================

        await updateMembershipRank(userId);


        // ========================================
        // LẤY TỔNG QUAN
        // ========================================

        const result = await sql.query`
            SELECT
                (SELECT COUNT(*) FROM Orders WHERE user_id = ${userId}) AS totalOrders,
                (SELECT COUNT(*) FROM Orders WHERE user_id = ${userId} AND status = N'Hoàn thành') AS completedOrders,
                (SELECT ISNULL(SUM(Cart.quantity), 0)
                FROM Cart
                INNER JOIN Orders ON Cart.order_id = Orders.order_id
                WHERE Orders.user_id = ${userId}
                AND Orders.status = N'Hoàn thành') AS totalProducts,
                (SELECT ISNULL(SUM(total), 0)
                FROM Orders
                WHERE user_id = ${userId}
                AND status = N'Hoàn thành') AS totalMoney,
                (SELECT membership_rank FROM users WHERE id = ${userId}) AS membershipRank,
                (SELECT role FROM users WHERE id = ${userId}) AS role
        `;


        res.json(
            result.recordset[0]
        );


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