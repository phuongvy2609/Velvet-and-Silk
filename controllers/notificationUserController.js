
const { db } = require("../config/db");


// ========================================
// LẤY THÔNG BÁO CỦA USER
// ========================================

const getUserNotifications = async (req, res) => {
    try {
        const userId = req.session.user?.id || 0;

        const [result] = await db.query(
            `SELECT
                notification_id,
                notification_type,
                notification_title,
                notification_content,
                order_id,
                is_read,
                created_at,
                user_id
            FROM Notifications
            WHERE user_id = ?
            ORDER BY created_at DESC`,
            [userId]
        );

        res.json(result);

    } catch (error) {
        res.status(500).json([]);
    }
};


// ========================================
// ĐÁNH DẤU 1 THÔNG BÁO ĐÃ ĐỌC
// ========================================

const readUserNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.session.user?.id || 0;

        await db.query(
            `UPDATE Notifications
             SET is_read = 1
             WHERE notification_id = ?
             AND user_id = ?`,
            [notificationId, userId]
        );

        res.json({
            success: true
        });

    } catch (error) {
        res.status(500).json({
            success: false
        });
    }
};


// ========================================
// XÓA 1 THÔNG BÁO
// ========================================

const deleteUserNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.session.user?.id || 0;

        await db.query(
            `DELETE FROM Notifications
             WHERE notification_id = ?
             AND user_id = ?`,
            [notificationId, userId]
        );

        res.json({
            success: true
        });

    } catch (error) {
        res.status(500).json({
            success: false
        });
    }
};


// ========================================
// ĐÁNH DẤU TẤT CẢ ĐÃ ĐỌC
// ========================================

const readAllUserNotifications = async (req, res) => {
    try {
        const userId = req.session.user?.id || 0;

        await db.query(
            `UPDATE Notifications
             SET is_read = 1
             WHERE user_id = ?`,
            [userId]
        );

        res.json({
            success: true
        });

    } catch (error) {
        res.status(500).json({
            success: false
        });
    }
};


// ========================================
// TẠO THÔNG BÁO ĐƠN HÀNG CHO USER
// ========================================

const createUserOrderNotification = async (
    userId,
    orderId,
    status
) => {
    try {
        const notificationType = "order";
        const notificationTitle = "Cập nhật đơn hàng";

        const notificationContent =
            `Đơn hàng #${orderId} đã được cập nhật trạng thái: ${status}`;

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
                notificationType,
                notificationTitle,
                notificationContent,
                orderId,
                0,
                userId
            ]
        );

    } catch (error) {
    }
};


// ========================================
// TẠO THÔNG BÁO PHẢN HỒI LIÊN HỆ
// ADMIN → USER
// ========================================

const createUserContactNotification = async (
    userId,
    content
) => {
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
            VALUES (?, ?, ?, NULL, 0, NOW(), ?)`,
            [
                "contact",
                "Shop đã phản hồi liên hệ cho bạn",
                content,
                userId
            ]
        );

    } catch (error) {
    }
};


// ========================================
// TẠO THÔNG BÁO PHẢN HỒI ĐÁNH GIÁ
// ADMIN → USER
// ========================================

const createUserReviewNotification = async (
    userId,
    content
) => {
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
            VALUES (?, ?, ?, NULL, 0, NOW(), ?)`,
            [
                "review",
                "Phản hồi đánh giá",
                content,
                userId
            ]
        );

    } catch (error) {
    }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
    getUserNotifications,
    readUserNotification,
    deleteUserNotification,
    readAllUserNotifications,
    createUserOrderNotification,
    createUserContactNotification,
    createUserReviewNotification
};
