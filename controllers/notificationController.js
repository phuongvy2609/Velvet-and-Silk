const { sql } = require("../config/db");


// ========================================
// TẠO THÔNG BÁO ĐÁNH GIÁ
// ========================================

const createReviewNotification = async (review) => {

    try {

        await sql.query`

            INSERT INTO Notifications
            (
                notification_type,
                notification_title,
                notification_content,
                order_id,
                is_read,
                created_at
            )

            VALUES
            (
                ${"review"},
                ${`Có Đánh Giá ${review.product_name || "Sản phẩm"} Mới`},
                ${`Từ ${review.customer_name || "Khách hàng"} - ${review.rating || 0} sao`},
                ${null},
                ${0},
                GETDATE()
            )

        `;

    } catch (error) {

        console.log(
            "LỖI TẠO THÔNG BÁO ĐÁNH GIÁ:",
            error.message
        );

    }

};




// ========================================
// TẠO THÔNG BÁO PHẢN HỒI LIÊN HỆ
// ========================================

const createContactNotification = async (contact) => {

    try {

        await sql.query`

            INSERT INTO Notifications
            (
                notification_type,
                notification_title,
                notification_content,
                order_id,
                is_read,
                created_at
            )

            VALUES
            (
                ${"contact"},
                ${"Có Phản Hồi Liên Hệ Mới"},
                ${`Từ ${contact.name || "Khách hàng"} - Email: ${contact.email || ""}`},
                ${null},
                ${0},
                GETDATE()
            )

        `;

    } catch (error) {

        console.log(
            "LỖI TẠO THÔNG BÁO LIÊN HỆ:",
            error.message
        );

    }

};





// ========================================
// TẠO THÔNG BÁO KHÁCH HÀNG ĐĂNG KÝ
// ========================================

const createRegisterNotification = async (user) => {

    try {

        await sql.query`

            INSERT INTO Notifications
            (
                notification_type,
                notification_title,
                notification_content,
                order_id,
                is_read,
                created_at
            )

            VALUES
            (
                ${"register"},
                ${"Có Khách Hàng Mới Đăng Ký"},
                ${`${user.fullname || "Khách hàng"} - Email: ${user.email || ""}`},
                ${null},
                ${0},
                GETDATE()
            )

        `;

    } catch (error) {

        console.log(
            "LỖI TẠO THÔNG BÁO ĐĂNG KÝ:",
            error.message
        );

    }

};





// ========================================
// LẤY TẤT CẢ THÔNG BÁO
// ========================================

const getNotifications = async (req, res) => {

    try {

        const result = await sql.query`

            SELECT
                notification_id,
                notification_type,
                notification_title,
                notification_content,
                order_id,
                is_read,
                created_at

            FROM Notifications
            WHERE user_id IS NULL
            ORDER BY notification_id DESC

        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).send(error.message);

    }

};


// ========================================
// ĐẾM THÔNG BÁO CHƯA ĐỌC
// ========================================

const getUnreadNotificationCount = async (req, res) => {

    try {

        const result = await sql.query`

            SELECT COUNT(*) AS total

            FROM Notifications

            WHERE is_read = 0
            AND user_id IS NULL

        `;

        res.json({

            total: result.recordset[0].total

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

        const notificationId =
            Number(req.params.id);


        await sql.query`

            UPDATE Notifications

            SET is_read = 1

            WHERE notification_id = ${notificationId}
            AND user_id IS NULL
        `;

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

        const notificationId =
            Number(req.params.id);


        await sql.query`

            DELETE FROM Notifications

            WHERE notification_id = ${notificationId}
            AND user_id IS NULL
        `;


        res.send("ok");

    } catch (error) {

        res.status(500).send(error.message);

    }

};


const createOrderNotification = async (order) => {

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
                'order',
                N'Có đơn hàng mới',
                ${`Đơn hàng #${order.order_id} vừa được đặt`},
                ${order.order_id},
                0,
                GETDATE(),
                NULL
            )

        `;

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