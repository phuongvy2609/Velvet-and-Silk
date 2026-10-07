//Nhập đối tượng kết nối cơ sở dữ liệu từ file cấu hình của bạn.
const {sql} = require('../config/db'); 
const {
    createRegisterNotification
} = require("./notificationController");



// ĐĂNG KÝ
const register = async (req, res) => {
    const { fullname, phone, email, password } = req.body;

    try {
        const check = await sql.query`
            SELECT * FROM users WHERE email = ${email}
        `;

        if (check.recordset.length > 0) {
            return res.send("Email đã tồn tại!");
        }

        await sql.query`
            INSERT INTO users(fullname, phone, email, password)
            VALUES(${fullname}, ${phone}, ${email}, ${password})
        `;

        await createRegisterNotification({

            fullname: fullname,

            email: email

        });

        res.send("ok");

    } catch (err) {
        res.status(500).send(err.message);
    }
};


// ĐĂNG NHẬP
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await sql.query`
            SELECT * FROM users
            WHERE email = ${email}
            AND password = ${password}
        `;

        if (result.recordset.length > 0) {

            const user = result.recordset[0];

            req.session.user = {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                role: user.role
            };

            // Chỉ trả kết quả
            if (user.role === "admin") {
                res.send("admin");
            } else {
                res.send("user");
            }

        } else {
            res.send("Sai!");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
};


// LẤY THÔNG TIN CÁ NHÂN
const getProfile = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({});
        }
        const id = req.session.user.id;
        const result = await sql.query`
            SELECT 
                id,
                fullname,
                phone,
                email,
                role,
                membership_rank
            FROM users
            WHERE id = ${id}
        `;

        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({});
    }
};



// CẬP NHẬT THÔNG TIN CÁ NHÂN
const updateProfile = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({});
        }
        const id = req.session.user.id;
        const { fullname, phone, email } = req.body;

        await sql.query`
            UPDATE users
            SET
                fullname = ${fullname},
                phone = ${phone},
                email = ${email}
            WHERE id = ${id}
        `;

        // Cập nhật lại session
        req.session.user.fullname = fullname;
        req.session.user.phone = phone;
        req.session.user.email = email;

        res.json({
            success: true
        });

    } catch (err) {
        res.status(500).json({});
    }
};



// ĐỔI MẬT KHẨU
const changePassword = async (req, res) => {
    try {

        if (!req.session.user) {
            return res.status(401).send("Chưa đăng nhập");
        }

        const id = req.session.user.id;
        const { oldPassword, newPassword } = req.body;

        const result = await sql.query`
            SELECT password
            FROM users
            WHERE id = ${id}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).send("Không tìm thấy");
        }

        if (result.recordset[0].password !== oldPassword) {
            return res.status(400).send("Sai mật khẩu");
        }

        await sql.query`
            UPDATE users
            SET password = ${newPassword}
            WHERE id = ${id}
        `;

        res.send("Đổi mật khẩu thành công");

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};



// LẤY NGƯỜI DÙNG
const getAlluser = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT * FROM users
        `;

        res.json(result.recordset);
    }

    catch(err) {
        res.status(500).send(err.message);
    }
}



// XÓA NGƯỜI DÙNG
const deleteUser = async (req, res) => {
    const { id } = req.body;

    try {
        await sql.query`
            DELETE FROM users WHERE id = ${id}
        `;

        res.send("ok");
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// ĐĂNG XUẤT USER
const logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.send("ok");
    });
};


// ĐĂNG XUẤT ADMIN 
const logoutAdmin = (req, res) => {
    req.session.destroy(() => {
        res.send("ok");
    });
};





module.exports = { register, login, getAlluser, deleteUser, getProfile, updateProfile, changePassword, logoutAdmin, logoutUser };