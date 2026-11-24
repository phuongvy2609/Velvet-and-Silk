const { db } = require("../config/db");

const multer = require("multer");
const fs = require("fs");
const path = require("path");


// =================================
// TẠO THƯ MỤC UPLOAD
// =================================

const uploadPath = path.join(
    __dirname,
    "../assets/uploads/chat"
);

if (!fs.existsSync(uploadPath)) {

    fs.mkdirSync(uploadPath, {
        recursive: true
    });

}


// =================================
// CẤU HÌNH UPLOAD
// =================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, uploadPath);

    },

    filename: function (req, file, cb) {

        const name =
            Date.now() +
            "-" +
            file.originalname;

        cb(null, name);

    }

});


const upload = multer({
    storage: storage
});


// =================================
// LẤY DANH SÁCH KHÁCH HÀNG
// KÈM SỐ TIN CHƯA ĐỌC CỦA TỪNG KHÁCH
// =================================

const getChatCustomers = async (req, res) => {

    try {

        const [result] = await db.query(`
            SELECT 
                u.id,
                u.fullname,

                IFNULL(
                    SUM(
                        CASE
                            WHEN m.sender = 'user'
                            AND m.is_read = 0
                            THEN 1
                            ELSE 0
                        END
                    ),
                    0
                ) AS unread_count

            FROM Users u

            LEFT JOIN Messages m
                ON u.id = m.user_id

            WHERE u.chat_status = 1

            GROUP BY
                u.id,
                u.fullname

            ORDER BY
                u.fullname ASC
        `);

        res.json(result);

    } catch (error) {

        res.status(500).send(
            "Lỗi lấy danh sách khách hàng"
        );

    }

};


// =================================
// LẤY TỔNG SỐ TIN CHƯA ĐỌC
// =================================

const getUnreadMessageCount = async (req, res) => {

    try {

        const [result] = await db.query(`
            SELECT
                COUNT(*) AS total
            FROM Messages
            WHERE sender = 'user'
            AND is_read = 0
        `);

        res.json({
            total: result[0].total
        });

    } catch (error) {

        res.status(500).send(
            "Lỗi lấy số tin nhắn"
        );

    }

};


// =================================
// ĐÁNH DẤU TIN CỦA 1 KHÁCH ĐÃ ĐỌC
// =================================

const markMessagesAsRead = async (req, res) => {

    try {

        const user_id = req.params.user_id;


        await db.query(`
            UPDATE Messages
            SET is_read = 1
            WHERE user_id = ?
            AND sender = 'user'
            AND is_read = 0
        `, [user_id]);


        res.send("ok");

    } catch (error) {

        res.status(500).send(
            "Lỗi đánh dấu tin nhắn đã đọc"
        );

    }

};


// =================================
// LẤY TIN NHẮN
// =================================

const getAdminMessages = async (req, res) => {

    try {

        const user_id = req.params.user_id;


        const [result] = await db.query(`
            SELECT *
            FROM Messages
            WHERE user_id = ?
            ORDER BY created_at ASC
        `, [user_id]);


        res.json(result);

    } catch (error) {

        res.status(500).send(
            "Lỗi lấy tin nhắn"
        );

    }

};


// =================================
// ADMIN GỬI TEXT
// =================================

const adminSendMessage = async (req, res) => {

    try {

        const user_id = req.body.user_id;

        const message = req.body.message;


        await db.query(`
            INSERT INTO Messages
            (
                user_id,
                sender,
                message_type,
                message_text,
                is_read,
                created_at
            )
            VALUES
            (
                ?,
                'admin',
                'text',
                ?,
                1,
                DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 HOUR)
            )
        `, [user_id, message]);


        res.send("ok");

    } catch (error) {

        res.status(500).send(
            "Gửi tin nhắn thất bại"
        );

    }

};


// =================================
// ADMIN GỬI ẢNH
// =================================

const adminSendImage = [

    upload.single("image"),

    async function (req, res) {

        try {

            const user_id = req.body.user_id;

            const file = req.file;


            if (!file) {

                res.json({
                    success: false
                });

                return;

            }


            const file_url =
                "/uploads/chat/" +
                file.filename;


            await db.query(`
                INSERT INTO Messages
                (
                    user_id,
                    sender,
                    message_type,
                    file_url,
                    file_name,
                    is_read,
                    created_at
                )
                VALUES
                (
                    ?,
                    'admin',
                    'image',
                    ?,
                    ?,
                    1,
                    DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 HOUR)
                )
            `, [
                user_id,
                file_url,
                file.originalname
            ]);


            res.json({

                success: true,

                file_url: file_url,

                file_name: file.originalname

            });

        } catch (error) {

            res.status(500).send(
                "Gửi ảnh thất bại"
            );

        }

    }

];


// =================================
// ADMIN GỬI FILE
// =================================

const adminSendFile = [

    upload.single("file"),

    async function (req, res) {

        try {

            const user_id = req.body.user_id;

            const file = req.file;


            if (!file) {

                res.json({
                    success: false
                });

                return;

            }


            const file_url =
                "/uploads/chat/" +
                file.filename;


            await db.query(`
                INSERT INTO Messages
                (
                    user_id,
                    sender,
                    message_type,
                    file_url,
                    file_name,
                    is_read,
                    created_at
                )
                VALUES
                (
                    ?,
                    'admin',
                    'file',
                    ?,
                    ?,
                    1,
                    DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 HOUR)
                )
            `, [
                user_id,
                file_url,
                file.originalname
            ]);


            res.json({

                success: true,

                file_url: file_url,

                file_name: file.originalname

            });

        } catch (error) {

            res.status(500).send(
                "Gửi file thất bại"
            );

        }

    }

];


// =================================
// KẾT THÚC TƯ VẤN
// =================================

const finishChat = async (req, res) => {

    try {

        const user_id = req.params.user_id;


        await db.query(`
            UPDATE Users
            SET chat_status = 0
            WHERE id = ?
        `, [user_id]);


        res.send("ok");

    } catch (error) {

        res.status(500).send(
            "Không thể kết thúc tư vấn"
        );

    }

};


// =================================
// EXPORT
// =================================

module.exports = {

    getChatCustomers,

    getAdminMessages,

    adminSendMessage,

    adminSendImage,

    adminSendFile,

    getUnreadMessageCount,

    markMessagesAsRead,

    finishChat

};