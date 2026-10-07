const { sql, connectDB } = require("../config/db");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

connectDB();

const uploadPath = path.join(
    __dirname,
    "../assets/uploads/chat"
);

if (!fs.existsSync(uploadPath)) {

    fs.mkdirSync(uploadPath, {
        recursive: true
    });

}

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

        const result = await sql.query(`
            SELECT 
                u.id,
                u.fullname,

                ISNULL(
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

        res.json(result.recordset);

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

        const result = await sql.query(`
            SELECT
                COUNT(*) AS total
            FROM Messages
            WHERE sender = 'user'
            AND is_read = 0
        `);

        res.json({
            total: result.recordset[0].total
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

        const user_id =
            req.params.user_id;

        await sql.query(`
            UPDATE Messages
            SET is_read = 1
            WHERE user_id = ${user_id}
            AND sender = 'user'
            AND is_read = 0
        `);

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

        const user_id =
            req.params.user_id;

        const result = await sql.query(`
            SELECT *
            FROM Messages
            WHERE user_id = ${user_id}
            ORDER BY created_at ASC
        `);

        res.json(result.recordset);

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

        const user_id =
            req.body.user_id;

        const message =
            req.body.message;

        await sql.query(`
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
                ${user_id},
                'admin',
                'text',
                N'${message}',
                1,
                DATEADD(HOUR, 7, GETUTCDATE())
            )
        `);

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

            const user_id =
                req.body.user_id;

            const file =
                req.file;

            if (!file) {

                res.json({
                    success: false
                });

                return;

            }

            const file_url =
                "/uploads/chat/" +
                file.filename;

            await sql.query(`
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
                    ${user_id},
                    'admin',
                    'image',
                    '${file_url}',
                    N'${file.originalname}',
                    1,
                    DATEADD(HOUR, 7, GETUTCDATE())
                )
            `);

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

            const user_id =
                req.body.user_id;

            const file =
                req.file;

            if (!file) {

                res.json({
                    success: false
                });

                return;

            }

            const file_url =
                "/uploads/chat/" +
                file.filename;

            await sql.query(`
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
                    ${user_id},
                    'admin',
                    'file',
                    '${file_url}',
                    N'${file.originalname}',
                    1,
                    DATEADD(HOUR, 7, GETUTCDATE())
                )
            `);

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



const finishChat = async (req, res) => {

    try {

        const user_id =
            req.params.user_id;

        await sql.query(`
            UPDATE Users
            SET chat_status = 0
            WHERE id = ${user_id}
        `);

        res.send("ok");

    } catch (error) {

        res.status(500).send(
            "Không thể kết thúc tư vấn"
        );

    }

};

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