const { sql, connectDB } = require("../config/db");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

connectDB();


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
// USER GỬI TEXT
// =================================

const sendMessage = async (req, res) => {

    if (!req.session.user) {

        return res
            .status(401)
            .send("Chưa đăng nhập");

    }


    const user_id =
        req.session.user.id;

    const message =
        req.body.message_text;


    // =============================
    // MỞ LẠI CUỘC TƯ VẤN
    // =============================

    await sql.query`

        UPDATE Users

        SET chat_status = 1

        WHERE id = ${user_id}

    `;


    // =============================
    // LƯU TIN NHẮN USER
    // =============================

    await sql.query`

        INSERT INTO Messages
        (
            user_id,
            sender,
            message_type,
            message_text,
            is_read
        )

        VALUES
        (
            ${user_id},
            'user',
            'text',
            ${message},
            0
        )

    `;


    res.send("ok");

};


// =================================
// USER GỬI ẢNH
// =================================

const sendImage = [

    upload.single("image"),

    async function (req, res) {

        if (!req.session.user) {

            return res
                .status(401)
                .send("Chưa đăng nhập");

        }


        if (!req.file) {

            return res
                .status(400)
                .send("Chưa chọn ảnh");

        }


        const user_id =
            req.session.user.id;

        const file_name =
            req.file.filename;

        const file_url =
            "/uploads/chat/" +
            file_name;


        // =============================
        // MỞ LẠI CUỘC TƯ VẤN
        // =============================

        await sql.query`

            UPDATE Users

            SET chat_status = 1

            WHERE id = ${user_id}

        `;


        // =============================
        // LƯU ẢNH
        // =============================

        await sql.query`

            INSERT INTO Messages
            (
                user_id,
                sender,
                message_type,
                file_name,
                file_url,
                is_read
            )

            VALUES
            (
                ${user_id},
                'user',
                'image',
                ${file_name},
                ${file_url},
                0
            )

        `;


        res.json({

            success: true,

            file_name: file_name,

            file_url: file_url

        });

    }

];


// =================================
// USER GỬI FILE
// =================================

const sendFile = [

    upload.single("file"),

    async function (req, res) {

        if (!req.session.user) {

            return res
                .status(401)
                .send("Chưa đăng nhập");

        }


        if (!req.file) {

            return res
                .status(400)
                .send("Chưa chọn file");

        }


        const user_id =
            req.session.user.id;

        const file_name =
            req.file.originalname;

        const file_url =
            "/uploads/chat/" +
            req.file.filename;


        // =============================
        // MỞ LẠI CUỘC TƯ VẤN
        // =============================

        await sql.query`

            UPDATE Users

            SET chat_status = 1

            WHERE id = ${user_id}

        `;


        // =============================
        // LƯU FILE
        // =============================

        await sql.query`

            INSERT INTO Messages
            (
                user_id,
                sender,
                message_type,
                file_name,
                file_url,
                is_read
            )

            VALUES
            (
                ${user_id},
                'user',
                'file',
                ${file_name},
                ${file_url},
                0
            )

        `;


        res.json({

            success: true,

            file_name: file_name,

            file_url: file_url

        });

    }

];


// =================================
// LẤY LỊCH SỬ CHAT
// =================================

const getMessages = async (req, res) => {

    if (!req.session.user) {

        return res
            .status(401)
            .json([]);

    }


    const user_id =
        req.session.user.id;


    // =============================
    // LẤY TIN NHẮN
    // =============================

    const result =
        await sql.query`

            SELECT
                id,
                user_id,
                sender,
                message_type,
                message_text,
                file_name,
                file_url,
                created_at

            FROM Messages

            WHERE user_id = ${user_id}

            ORDER BY created_at ASC

        `;


    res.json(
        result.recordset
    );

};


// =================================
// EXPORT
// =================================

module.exports = {

    sendMessage,

    sendImage,

    sendFile,

    getMessages

};