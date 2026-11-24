const { db } = require('../config/db');


// ========================================
// THÊM VÀO GIỎ HÀNG
// ========================================

const addToCart = async (req, res) => {

    try {

        // LẤY USER ID TỪ SESSION
        const user_id = req.session.user.id;


        // LẤY DỮ LIỆU SẢN PHẨM
        const {
            product_name,
            quantity,
            image,
            price,
            price_old,
            size
        } = req.body;


        // KIỂM TRA SẢN PHẨM CÙNG SIZE ĐÃ CÓ CHƯA
        const [result] = await db.query(

            `SELECT
                cart_id,
                quantity
            FROM Cart
            WHERE user_id = ?
            AND product_name = ?
            AND size = ?
            AND order_id IS NULL`,

            [user_id, product_name, size]

        );


        // NẾU ĐÃ CÓ SẢN PHẨM CÙNG SIZE
        // THÌ CỘNG THÊM SỐ LƯỢNG

        if (result.length > 0) {

            const cart_id = result[0].cart_id;

            const oldQuantity = Number(result[0].quantity);

            const newQuantity = oldQuantity + Number(quantity);


            await db.query(

                `UPDATE Cart
                SET quantity = ?
                WHERE cart_id = ?
                AND order_id IS NULL`,

                [newQuantity, cart_id]

            );


        } else {

            // NẾU CHƯA CÓ
            // THÌ THÊM SẢN PHẨM MỚI

            await db.query(

                `INSERT INTO Cart
                (
                    user_id,
                    product_name,
                    quantity,
                    image,
                    price,
                    price_old,
                    size
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)`,

                [
                    user_id,
                    product_name,
                    quantity,
                    image,
                    price,
                    price_old,
                    size
                ]

            );

        }


        // THÊM THÀNH CÔNG
        res.send("ok");


    } catch (error) {

        res.status(500).send(error.message);

    }

};


// ========================================
// LẤY GIỎ HÀNG
// ========================================

const getCart = async (req, res) => {

    try {

        const user = req.session.user;


        if (!user) {
            return res.json([]);
        }


        const [result] = await db.query(

            `SELECT
                cart_id,
                user_id,
                product_name,
                quantity,
                image,
                price,
                price_old,
                size,
                order_id
            FROM Cart
            WHERE user_id = ?
            AND order_id IS NULL`,

            [user.id]

        );


        res.json(result);


    } catch (error) {

        res.status(500).send(error.message);

    }

};


// ========================================
// LẤY TỔNG SỐ LƯỢNG GIỎ HÀNG
// ========================================

const getCartCount = async (req, res) => {

    try {

        const user = req.session.user;


        if (!user) {

            return res.json({
                total: 0
            });

        }


        const [result] = await db.query(

            `SELECT
                COUNT(DISTINCT product_name) AS total
            FROM Cart
            WHERE user_id = ?
            AND order_id IS NULL`,

            [user.id]

        );


        res.json({

            total: result[0].total

        });


    } catch (error) {

        res.status(500).send(error.message);

    }

};


// ========================================
// CẬP NHẬT SỐ LƯỢNG
// ========================================

const updateCart = async (req, res) => {

    try {

        const {
            cart_id,
            quantity
        } = req.body;


        await db.query(

            `UPDATE Cart
            SET quantity = ?
            WHERE cart_id = ?
            AND order_id IS NULL`,

            [quantity, cart_id]

        );


        res.send("ok");


    } catch (error) {

        res.status(500).send(error.message);

    }

};


// ========================================
// XÓA SẢN PHẨM KHỎI GIỎ HÀNG
// ========================================

const deleteCart = async (req, res) => {

    try {

        const {
            cart_id
        } = req.body;


        await db.query(

            `DELETE FROM Cart
            WHERE cart_id = ?
            AND order_id IS NULL`,

            [cart_id]

        );


        res.send("ok");


    } catch (error) {

        res.status(500).send(error.message);

    }

};


// ========================================
// MUA NGAY
// ========================================

const buyNow = async (req, res) => {

    try {

        const user = req.session.user;


        if (!user) {
            return res.status(401).send("error");
        }


        const {
            product_id,
            product_name,
            image,
            price,
            price_old,
            quantity,
            size
        } = req.body;


        req.session.buyNow = {

            user_id: user.id,
            product_id: product_id,
            product_name: product_name,
            image: image,
            price: price,
            price_old: price_old,
            quantity: quantity,
            size: size

        };


        res.send("ok");


    } catch (error) {

        res.status(500).send("error");

    }

};


// ========================================
// LẤY SẢN PHẨM MUA NGAY
// ========================================

const getBuyNow = async (req, res) => {

    try {

        // CHƯA ĐĂNG NHẬP
        if (!req.session.user) {

            return res
                .status(401)
                .send("Vui lòng đăng nhập!");

        }


        // ĐÃ ĐĂNG NHẬP NHƯNG CHƯA CÓ SẢN PHẨM MUA NGAY
        if (!req.session.buyNow) {

            return res.json(null);

        }


        // TRẢ SẢN PHẨM MUA NGAY
        res.json(req.session.buyNow);


    } catch (error) {

        res.status(500).send("error");

    }

};



module.exports = {

    addToCart,
    getCart,
    updateCart,
    deleteCart,
    getCartCount,
    buyNow,
    getBuyNow

};