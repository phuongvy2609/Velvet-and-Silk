
const { db } = require("../config/db");

// ========================================
// TẠO THÔNG BÁO ĐÁNH GIÁ
// ========================================

const createReviewNotification = async (review) => {
    try {
        await db.query(
            `INSERT INTO Notifications
            (
                notification_type,
                notification_title,
                notification_content,
                order_id,
                is_read,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, NOW())`,
            [
                "review",
                `Có Đánh Giá ${review.product_name || "Sản phẩm"} Mới`,
                `Từ ${review.customer_name || "Khách hàng"} - ${review.rating || 0} sao`,
                null,
                0
            ]
        );
    } catch (error) {
    }
};


// ========================================
// TẠO THÔNG BÁO PHẢN HỒI LIÊN HỆ
// ========================================

const createContactNotification = async (contact) => {
    try {
        await db.query(
            `INSERT INTO Notifications
            (
                notification_type,
                notification_title,
                notification_content,
                order_id,
                is_read,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, NOW())`,
            [
                "contact",
                "Có Phản Hồi Liên Hệ Mới",
                `Từ ${contact.name || "Khách hàng"} - Email: ${contact.email || ""}`,
                null,
                0
            ]
        );
    } catch (error) {
    }
};


// ========================================
// TẠO THÔNG BÁO KHÁCH HÀNG ĐĂNG KÝ
// ========================================

const createRegisterNotification = async (user) => {
    try {
        await db.query(
            `INSERT INTO Notifications
            (
                notification_type,
                notification_title,
                notification_content,
                order_id,
                is_read,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, NOW())`,
            [
                "register",
                "Có Khách Hàng Mới Đăng Ký",
                `${user.fullname || "Khách hàng"} - Email: ${user.email || ""}`,
                null,
                0
            ]
        );
    } catch (error) {
    }
};


// ========================================
// LẤY TẤT CẢ THÔNG BÁO
// ========================================

const getNotifications = async (req, res) => {
    try {
        const [result] = await db.query(
            `SELECT
                notification_id,
                notification_type,
                notification_title,
                notification_content,
                order_id,
                is_read,
                created_at
            FROM Notifications
            WHERE user_id IS NULL
            ORDER BY notification_id DESC`
        );

        res.json(result);

    } catch (error) {
        res.status(500).send(error.message);
    }
};


// ========================================
// ĐẾM THÔNG BÁO CHƯA ĐỌC
// ========================================

const getUnreadNotificationCount = async (req, res) => {
    try {
        const [result] = await db.query(
            `SELECT COUNT(*) AS total
            FROM Notifications
            WHERE is_read = 0
            AND user_id IS NULL`
        );

        res.json({
            total: result[0].total
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
};


// ========================================
// ĐÁNH DẤU ĐÃ ĐỌC
// ========================================

const readNotification = async (req, res) => {
    try {
        const notificationId = Number(req.params.id);

        await db.query(
            `UPDATE Notifications
            SET is_read = 1
            WHERE notification_id = ?
            AND user_id IS NULL`,
            [notificationId]
        );

        res.send("ok");

    } catch (error) {
        res.status(500).send(error.message);
    }
};


// ========================================
// XÓA THÔNG BÁO
// ========================================

const deleteNotification = async (req, res) => {
    try {
        const notificationId = Number(req.params.id);

        await db.query(
            `DELETE FROM Notifications
            WHERE notification_id = ?
            AND user_id IS NULL`,
            [notificationId]
        );

        res.send("ok");

    } catch (error) {
        res.status(500).send(error.message);
    }
};


// ========================================
// TẠO THÔNG BÁO ĐƠN HÀNG
// ========================================

const createOrderNotification = async (order) => {
    try {
        await db.query(
            `INSERT INTO Notifications
            (
                notification_type,
                notification_title,
                notification_content,
                order_id,
                is_read,
                created_at,
                user_id
            )
            VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
            [
                "order",
                "Có đơn hàng mới",
                `Đơn hàng #${order.order_id} vừa được đặt`,
                order.order_id,
                0,
                null
            ]
        );
    } catch (error) {
    }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
    createReviewNotification,
    createContactNotification,
    createRegisterNotification,
    getNotifications,
    getUnreadNotificationCount,
    readNotification,
    deleteNotification,
    createOrderNotification
};
