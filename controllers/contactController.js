
const { db } = require("../config/db");

const {
    createContactNotification
} = require("./notificationController");

const {
    createUserContactNotification
} = require("./notificationUserController");

const nodemailer = require("nodemailer");


// ========================================
// GỬI LIÊN HỆ
// ========================================

const sendContact = async (req, res) => {
    const {
        name,
        email,
        mess
    } = req.body;

    try {
        await db.query(
            `INSERT INTO contact
            (
                name,
                email,
                mess,
                status
            )
            VALUES (?, ?, ?, ?)`,
            [name, email, mess, 'Chưa đọc']
        );

        await createContactNotification({
            name: name,
            email: email
        });

        res.send("ok");

    } catch (err) {
        res.status(500).send(err.message);
    }
};


// ========================================
// LẤY LIÊN HỆ
// ========================================

const getContact = async (req, res) => {
    try {
        const [kq] = await db.query(
            `SELECT * FROM contact`
        );

        res.json(kq);

    } catch (err) {
        res.status(500).send(err.message);
    }
};


// ========================================
// XÓA LIÊN HỆ
// ========================================

const deleteContact = async (req, res) => {
    const { id } = req.body;

    try {
        await db.query(
            `DELETE FROM contact
             WHERE id = ?`,
            [id]
        );

        res.send("ok");

    } catch (err) {
        res.status(500).send(err.message);
    }
};


// ========================================
// ĐỔI TRẠNG THÁI ĐÃ ĐỌC
// ========================================

const readContact = async (req, res) => {
    const { id } = req.body;

    try {
        await db.query(
            `UPDATE contact
             SET status = ?
             WHERE id = ?`,
            ['Đã đọc', id]
        );

        res.send("ok");

    } catch (err) {
        res.status(500).send(err.message);
    }
};


// ========================================
// GỬI EMAIL GMAIL
// ========================================

const sendMail = async (req, res) => {
    const {
        to,
        subject,
        text
    } = req.body;

    try {
        if (!to) {
            return res.status(400).send("Thiếu email người nhận");
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: `Velvet & Silk <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text
        });


        // TÌM USER THEO EMAIL
        const [userResult] = await db.query(
            `SELECT id
             FROM Users
             WHERE email = ?`,
            [to]
        );

        if (userResult.length > 0) {
            const userId = userResult[0].id;

            await createUserContactNotification(
                userId,
                `Từ mail: ${process.env.EMAIL_USER}`
            );
        }

        res.status(200).send("Gửi mail thành công");

    } catch (err) {
        res.status(500).send(err.message);
    }
};


// ========================================
// TẠO THÔNG BÁO PHẢN HỒI LIÊN HỆ
// ========================================

const createContactReplyNotification = async (req, res) => {
    try {
        const { email } = req.body;

        const [userResult] = await db.query(
            `SELECT id
             FROM Users
             WHERE email = ?`,
            [email]
        );

        if (userResult.length === 0) {
            return res.status(404).send("Không tìm thấy user");
        }

        const userId = userResult[0].id;

        await createUserContactNotification(
            userId,
            "Shop đã phản hồi liên hệ cho bạn. Vui lòng kiểm tra email để xem nội dung phản hồi."
        );

        res.status(200).send("Đã tạo thông báo");

    } catch (error) {
        res.status(500).send("Lỗi tạo thông báo");
    }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
    sendContact,
    getContact,
    deleteContact,
    readContact,
    sendMail,
    createContactReplyNotification
};
