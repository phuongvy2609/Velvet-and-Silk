const { sql } = require("../config/db");


// ========================================
// LẤY THÔNG BÁO CỦA USER
// ========================================

const getUserNotifications = async (req, res) => {

    try {

        const userId =
            req.session.user?.id || 0;

        const result =
            await sql.query`

                SELECT
                    notification_id,
                    notification_type,
                    notification_title,
                    notification_content,
                    order_id,
                    is_read,
                    created_at,
                    user_id

                FROM Notifications

                WHERE user_id = ${userId}

                ORDER BY created_at DESC

            `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json([]);

    }

};


// ========================================
// ĐÁNH DẤU 1 THÔNG BÁO ĐÃ ĐỌC
// ========================================

const readUserNotification = async (req, res) => {

    try {

        const notificationId =
            req.params.id;

        const userId =
            req.session.user?.id || 0;

        await sql.query`

            UPDATE Notifications

            SET is_read = 1

            WHERE notification_id = ${notificationId}

            AND user_id = ${userId}

        `;

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

        const notificationId =
            req.params.id;

        const userId =
            req.session.user?.id || 0;

        await sql.query`

            DELETE FROM Notifications

            WHERE notification_id = ${notificationId}

            AND user_id = ${userId}

        `;

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

        const userId =
            req.session.user?.id || 0;

        await sql.query`

            UPDATE Notifications

            SET is_read = 1

            WHERE user_id = ${userId}

        `;

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

        const notificationType =
            "order";

        const notificationTitle =
            "Cập nhật đơn hàng";

        const notificationContent =
            `Đơn hàng #${orderId} đã được cập nhật trạng thái: ${status}`;

        await sql.query`

            INSERT INTO Notifications
            (
                notification_type,
                notification_title,
                notification_content,
                order_id,
                is_read,
                created_at,
                user_id
            )

            VALUES
            (
                ${notificationType},
                ${notificationTitle},
                ${notificationContent},
                ${orderId},
                0,
                GETDATE(),
                ${userId}
            )

        `;

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

        await sql.query`

            INSERT INTO Notifications
            (
                notification_type,
                notification_title,
                notification_content,
                order_id,
                is_read,
                created_at,
                user_id
            )

            VALUES
            (
                'contact',
                N'Shop đã phản hồi liên hệ cho bạn',
                ${content},
                NULL,
                0,
                GETDATE(),
                ${userId}
            )

        `;

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

        await sql.query`

            INSERT INTO Notifications
            (
                notification_type,
                notification_title,
                notification_content,
                order_id,
                is_read,
                created_at,
                user_id
            )

            VALUES
            (
                'review',
                N'Phản hồi đánh giá',
                ${content},
                NULL,
                0,
                GETDATE(),
                ${userId}
            )

        `;

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