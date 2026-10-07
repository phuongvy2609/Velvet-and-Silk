const { sql } = require('../config/db');

const {
    createReviewNotification
} = require("./notificationController");

const {
    createUserReviewNotification
} = require("./notificationUserController");

// LẤY TẤT CẢ ĐÁNH GIÁ USER
const getAllReview = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT *
            FROM reviews
        `;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// THÊM ĐÁNH GIÁ USER
const addReview = async (req, res) => {
    const { 
        customer_name, 
        product_id, 
        product_name, 
        rating, 
        comment 
    } = req.body;

    try {
        await sql.query`
            INSERT INTO Reviews
            (customer_name, product_id, product_name, rating, comment)
            VALUES
            (${customer_name}, ${product_id}, ${product_name}, ${rating}, ${comment})
        `;

        // TẠO THÔNG BÁO CHO ADMIN
        await createReviewNotification({

            customer_name: customer_name,

            product_name: product_name,

            rating: rating

        });

        res.send("ok");

    } catch (err) {
        res.status(500).send(err.message);
    }
};


// XÓA ĐÁNH GIÁ ADMIN
const deleteReview = async (req, res) => {
    const { id } = req.body;
    try {
        await sql.query`
            DELETE FROM reviews
            WHERE id = ${id}
        `;

        res.send("ok");

    } catch (err) {
        res.status(500).send(err.message);
    }
};


// PHẢN HỒI ĐÁNH GIÁ ADMIN
const replyReview = async (req, res) => {

    const {
        id,
        shop_reply
    } = req.body;

    try {

        const reviewResult =
            await sql.query`

                SELECT
                    customer_name,
                    product_name

                FROM Reviews

                WHERE id = ${id}

            `;


        if (
            reviewResult.recordset.length === 0
        ) {

            return res
                .status(404)
                .send("Không tìm thấy đánh giá");

        }


        const review =
            reviewResult.recordset[0];


        await sql.query`

            UPDATE Reviews

            SET
                shop_reply = ${shop_reply},
                reply_at = GETDATE()

            WHERE id = ${id}

        `;


        // ========================================
        // TÌM USER
        // ========================================

        const userResult =
            await sql.query`

                SELECT
                    id

                FROM Users

                WHERE fullname = ${review.customer_name}

            `;


        if (
            userResult.recordset.length > 0
        ) {

            const userId =
                userResult.recordset[0].id;


            const content =
                `Shop đã phản hồi đánh giá về sản phẩm ${review.product_name}: ${shop_reply}`;


            await createUserReviewNotification(
                userId,
                content
            );

        }


        res.send("ok");

    } catch (err) {

        res
            .status(500)
            .send(err.message);

    }

};

// LẤY TẤT CẢ ĐÁNH GIÁ ADMIN
const getAllReviewadmin = async (req, res) => {
    try {
        const { product_id } = req.params;
        const result = await sql.query`
            SELECT *
            FROM reviews
            WHERE product_id = ${product_id}
            ORDER BY id DESC
        `;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// SỬA PHẢN HỒI ĐÁNH GIÁ ADMIN
const fixReplyReview = async (req, res) => {

    const {
        id,
        shop_reply
    } = req.body;

    try {

        const reviewResult =
            await sql.query`

                SELECT
                    customer_name,
                    product_name

                FROM Reviews

                WHERE id = ${id}

            `;


        if (
            reviewResult.recordset.length === 0
        ) {

            return res
                .status(404)
                .send("Không tìm thấy đánh giá");

        }


        const review =
            reviewResult.recordset[0];


        await sql.query`

            UPDATE Reviews

            SET
                shop_reply = ${shop_reply},
                reply_at = GETDATE()

            WHERE id = ${id}

        `;


        // ========================================
        // TÌM USER
        // ========================================

        const userResult =
            await sql.query`

                SELECT
                    id

                FROM Users

                WHERE fullname = ${review.customer_name}

            `;


        if (
            userResult.recordset.length > 0
        ) {

            const userId =
                userResult.recordset[0].id;


            const content =
                `Shop đã phản hồi đánh giá về sản phẩm ${review.product_name}: ${shop_reply}`;


            await createUserReviewNotification(
                userId,
                content
            );

        }


        res.send("ok");

    } catch (err) {

        res
            .status(500)
            .send(err.message);

    }

};

const checkPurchasedProduct = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const productId = req.params.product_id;

        if (!userId) {
            res.json({ purchased: false });
            return;
        }

        const result = await sql.query`
            SELECT TOP 1 Cart.cart_id
            FROM Cart
            INNER JOIN Orders
                ON Cart.order_id = Orders.order_id
            INNER JOIN products
                ON Cart.product_name = products.product_name
            WHERE Cart.user_id = ${userId}
            AND products.product_id = ${productId}
            AND Cart.order_id IS NOT NULL
            AND Orders.status = N'Hoàn thành'
        `;

        if (result.recordset.length > 0) {
            res.json({ purchased: true });
            return;
        }

        res.json({ purchased: false });

    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    addReview,
    getAllReview,
    deleteReview,
    replyReview,
    getAllReviewadmin,
    fixReplyReview,
    checkPurchasedProduct
};


