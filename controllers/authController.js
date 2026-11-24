
const { db } = require('../config/db');

const {
    createRegisterNotification
} = require("./notificationController");



const register = async (req, res) => {
    const { fullname, phone, email, password } = req.body;

    try {
        const [check] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (check.length > 0) {
            return res.send("Email đã tồn tại!");
        }

        const [result] = await db.query(
            `INSERT INTO users (fullname, phone, email, password)
             VALUES (?, ?, ?, ?)`,
            [fullname, phone, email, password]
        );

        res.send("ok");

    } catch (err) {
        res.status(500).send("Lỗi đăng ký: " + err.message);
    }
};



// ĐĂNG NHẬP
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [result] = await db.query(
            `SELECT * FROM users
             WHERE email = ?
             AND password = ?`,
            [email, password]
        );

        if (result.length > 0) {
            const user = result[0];

            req.session.user = {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                role: user.role
            };

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

        const [result] = await db.query(
            `SELECT
                id,
                fullname,
                phone,
                email,
                role,
                membership_rank
             FROM users
             WHERE id = ?`,
            [id]
        );

        res.json(result[0] || {});

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

        await db.query(
            `UPDATE users
             SET
                fullname = ?,
                phone = ?,
                email = ?
             WHERE id = ?`,
            [fullname, phone, email, id]
        );

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

        const [result] = await db.query(
            `SELECT password
             FROM users
             WHERE id = ?`,
            [id]
        );

        if (result.length === 0) {
            return res.status(404).send("Không tìm thấy");
        }

        if (result[0].password !== oldPassword) {
            return res.status(400).send("Sai mật khẩu");
        }

        await db.query(
            `UPDATE users
             SET password = ?
             WHERE id = ?`,
            [newPassword, id]
        );

        res.send("Đổi mật khẩu thành công");

    } catch (err) {
        res.status(500).send("Lỗi server");
    }
};


// LẤY NGƯỜI DÙNG
const getAlluser = async (req, res) => {
    try {
        const [result] = await db.query(
            'SELECT * FROM users'
        );

        res.json(result);

    } catch (err) {
        res.status(500).send(err.message);
    }
};


// XÓA NGƯỜI DÙNG
const deleteUser = async (req, res) => {
    const { id } = req.body;

    try {
        await db.query(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

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


module.exports = {
    register,
    login,
    getAlluser,
    deleteUser,
    getProfile,
    updateProfile,
    changePassword,
    logoutAdmin,
    logoutUser
};
