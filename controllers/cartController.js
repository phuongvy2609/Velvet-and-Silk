const { sql } = require('../config/db');


// ========================================
// THÊM VÀO GIỎ HÀNG
// ========================================

const addToCart = async (req, res) => {

    try {

        // ========================================
        // LẤY USER ID TỪ SESSION
        // ========================================

        const user_id = req.session.user.id;


        // ========================================
        // LẤY DỮ LIỆU SẢN PHẨM
        // ========================================

        const {
            product_name,
            quantity,
            image,
            price,
            price_old,
            size
        } = req.body;


        // ========================================
        // KIỂM TRA SẢN PHẨM CÙNG SIZE ĐÃ CÓ CHƯA
        // ========================================

        const result = await sql.query`

            SELECT
                cart_id,
                quantity

            FROM Cart

            WHERE user_id = ${user_id}

            AND product_name = ${product_name}

            AND size = ${size}

            AND order_id IS NULL

        `;


        // ========================================
        // NẾU ĐÃ CÓ SẢN PHẨM CÙNG SIZE
        // THÌ CỘNG THÊM SỐ LƯỢNG
        // ========================================

        if (result.recordset.length > 0) {

            const cart_id =
                result.recordset[0].cart_id;

            const oldQuantity =
                Number(
                    result.recordset[0].quantity
                );

            const newQuantity =
                oldQuantity +
                Number(quantity);


            await sql.query`

                UPDATE Cart

                SET quantity = ${newQuantity}

                WHERE cart_id = ${cart_id}

                AND order_id IS NULL

            `;


        } else {

            // ========================================
            // NẾU CHƯA CÓ
            // THÌ THÊM SẢN PHẨM MỚI
            // ========================================

            await sql.query`

                INSERT INTO Cart
                (
                    user_id,
                    product_name,
                    quantity,
                    image,
                    price,
                    price_old,
                    size
                )

                VALUES
                (
                    ${user_id},
                    ${product_name},
                    ${quantity},
                    ${image},
                    ${price},
                    ${price_old},
                    ${size}
                )

            `;

        }


        // ========================================
        // THÊM THÀNH CÔNG
        // ========================================

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

        const result = await sql.query`

            SELECT
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

            WHERE user_id = ${user.id}

            AND order_id IS NULL

        `;

        res.json(result.recordset);

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


        const result = await sql.query`

            SELECT
                COUNT(DISTINCT product_name) AS total

            FROM Cart

            WHERE user_id = ${user.id}

            AND order_id IS NULL

        `;


        res.json({

            total:
                result.recordset[0].total

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


        await sql.query`

            UPDATE Cart

            SET quantity = ${quantity}

            WHERE cart_id = ${cart_id}

            AND order_id IS NULL

        `;


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


        await sql.query`

            DELETE FROM Cart

            WHERE cart_id = ${cart_id}

            AND order_id IS NULL

        `;


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


/// ========================================
// LẤY SẢN PHẨM MUA NGAY
// ========================================

const getBuyNow = async (req, res) => {

    try {

        // Chưa đăng nhập
        if (!req.session.user) {

            return res
                .status(401)
                .send("Vui lòng đăng nhập!");

        }

        // Đã đăng nhập nhưng chưa có sản phẩm mua ngay
        if (!req.session.buyNow) {

            return res.json(null);

        }

        // Trả sản phẩm mua ngay
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