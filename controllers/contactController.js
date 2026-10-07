const { sql } = require("../config/db");

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

        await sql.query`

            INSERT INTO contact
            (
                name,
                email,
                mess,
                status
            )

            VALUES
            (
                ${name},
                ${email},
                ${mess},
                N'Chưa đọc'
            )

        `;


        await createContactNotification({

            name: name,

            email: email

        });


        res.send("ok");

    }

    catch (err) {

        res
            .status(500)
            .send(err.message);

    }

};


// ========================================
// LẤY LIÊN HỆ
// ========================================

const getContact = async (req, res) => {

    try {

        const kq =
            await sql.query`

                SELECT *
                FROM contact

            `;


        res.json(
            kq.recordset
        );

    }

    catch (err) {

        res
            .status(500)
            .send(err.message);

    }

};


// ========================================
// XÓA LIÊN HỆ
// ========================================

const deleteContact = async (req, res) => {

    const {
        id
    } = req.body;

    try {

        await sql.query`

            DELETE FROM contact

            WHERE id = ${id}

        `;


        res.send("ok");

    }

    catch (err) {

        res
            .status(500)
            .send(err.message);

    }

};


// ========================================
// ĐỔI TRẠNG THÁI ĐÃ ĐỌC
// ========================================

const readContact = async (req, res) => {

    const {
        id
    } = req.body;

    try {

        await sql.query`

            UPDATE contact

            SET status = N'Đã đọc'

            WHERE id = ${id}

        `;


        res.send("ok");

    }

    catch (err) {

        res
            .status(500)
            .send(err.message);

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

            return res
                .status(400)
                .send("Thiếu email người nhận");

        }

        const transporter =
            nodemailer.createTransport({

                service: "gmail",

                auth: {

                    user:
                        "velvetandsilk26@gmail.com",

                    pass:
                        "zoubdrutlbpnusnn"

                }

            });


        await transporter.sendMail({

            from:
                "Velvet & Silk <velvetandsilk26@gmail.com>",

            to:
                to,

            subject:
                subject,

            text:
                text

        });

        // ========================================
        // TÌM USER THEO EMAIL
        // ========================================

        const userResult =
            await sql.query`

                SELECT
                    id

                FROM Users

                WHERE email = ${to}

            `;


        if (
            userResult.recordset.length > 0
        ) {

            const userId =
                userResult.recordset[0].id;


            await createUserContactNotification(
                userId,
                "Từ mail: velvetandsilk26@gmail.com"
            );

        }

        res
            .status(200)
            .send("Gửi mail thành công");

    }

    catch (err) {

        res
            .status(500)
            .send(err.message);

    }

};


const createContactReplyNotification = async (req, res) => {
    try {
        const { email } = req.body;

        const userResult = await sql.query`
            SELECT id
            FROM Users
            WHERE email = ${email}
        `;

        if (userResult.recordset.length === 0) {
            return res.status(404).send("Không tìm thấy user");
        }

        const userId = userResult.recordset[0].id;

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