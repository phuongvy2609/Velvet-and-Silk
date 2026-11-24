
const { db } = require('../config/db');

const {
    createReviewNotification
} = require("./notificationController");

const {
    createUserReviewNotification
} = require("./notificationUserController");


// LẤY TẤT CẢ ĐÁNH GIÁ USER
const getAllReview = async (req, res) => {
    try {
        const [result] = await db.query(
            `SELECT *
             FROM reviews`
        );

        res.json(result);

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
        await db.query(
            `INSERT INTO Reviews
            (customer_name, product_id, product_name, rating, comment)
            VALUES (?, ?, ?, ?, ?)`,
            [customer_name, product_id, product_name, rating, comment]
        );

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
        await db.query(
            `DELETE FROM reviews
             WHERE id = ?`,
            [id]
        );

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
        const [reviewResult] = await db.query(
            `SELECT
                customer_name,
                product_name
             FROM Reviews
             WHERE id = ?`,
            [id]
        );

        if (reviewResult.length === 0) {
            return res.status(404).send("Không tìm thấy đánh giá");
        }

        const review = reviewResult[0];

        await db.query(
            `UPDATE Reviews
             SET
                shop_reply = ?,
                reply_at = NOW()
             WHERE id = ?`,
            [shop_reply, id]
        );


        // TÌM USER
        const [userResult] = await db.query(
            `SELECT id
             FROM Users
             WHERE fullname = ?`,
            [review.customer_name]
        );

        if (userResult.length > 0) {
            const userId = userResult[0].id;

            const content =
                `Shop đã phản hồi đánh giá về sản phẩm ${review.product_name}: ${shop_reply}`;

            await createUserReviewNotification(
                userId,
                content
            );
        }

        res.send("ok");

    } catch (err) {
        res.status(500).send(err.message);
    }
};


// LẤY TẤT CẢ ĐÁNH GIÁ ADMIN
const getAllReviewadmin = async (req, res) => {
    try {
        const { product_id } = req.params;

        const [result] = await db.query(
            `SELECT *
             FROM reviews
             WHERE product_id = ?
             ORDER BY id DESC`,
            [product_id]
        );

        res.json(result);

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
        const [reviewResult] = await db.query(
            `SELECT
                customer_name,
                product_name
             FROM Reviews
             WHERE id = ?`,
            [id]
        );

        if (reviewResult.length === 0) {
            return res.status(404).send("Không tìm thấy đánh giá");
        }

        const review = reviewResult[0];

        await db.query(
            `UPDATE Reviews
             SET
                shop_reply = ?,
                reply_at = NOW()
             WHERE id = ?`,
            [shop_reply, id]
        );


        // TÌM USER
        const [userResult] = await db.query(
            `SELECT id
             FROM Users
             WHERE fullname = ?`,
            [review.customer_name]
        );

        if (userResult.length > 0) {
            const userId = userResult[0].id;

            const content =
                `Shop đã phản hồi đánh giá về sản phẩm ${review.product_name}: ${shop_reply}`;

            await createUserReviewNotification(
                userId,
                content
            );
        }

        res.send("ok");

    } catch (err) {
        res.status(500).send(err.message);
    }
};


// KIỂM TRA SẢN PHẨM ĐÃ MUA
const checkPurchasedProduct = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const productId = req.params.product_id;

        if (!userId) {
            res.json({ purchased: false });
            return;
        }

        const [result] = await db.query(
            `SELECT Cart.cart_id
             FROM Cart
             INNER JOIN Orders
                ON Cart.order_id = Orders.order_id
             INNER JOIN products
                ON Cart.product_name = products.product_name
             WHERE Cart.user_id = ?
             AND products.product_id = ?
             AND Cart.order_id IS NOT NULL
             AND Orders.status = ?
             LIMIT 1`,
            [userId, productId, 'Hoàn thành']
        );

        if (result.length > 0) {
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
