
const { db } = require('../config/db');


// ========================================
// THÊM ĐỊA CHỈ
// ========================================

const createAddress = async (req, res) => {

    try {

        const user_id = req.session.user.id;

        const {
            fullname,
            phone,
            province_name,
            ward_name,
            address,
            is_default
        } = req.body;


        // NẾU CHỌN ĐỊA CHỈ MẶC ĐỊNH
        if (is_default) {

            const [checkDefault] = await db.query(`
                SELECT address_id
                FROM user_addresses
                WHERE user_id = ?
                AND is_default = 1
            `, [user_id]);

            if (checkDefault.length > 0) {

                return res.send('Have');

            }

        }


        // THÊM ĐỊA CHỈ
        await db.query(`
            INSERT INTO user_addresses
            (
                user_id,
                fullname,
                phone,
                province_name,
                ward_name,
                address,
                is_default
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            user_id,
            fullname,
            phone,
            province_name,
            ward_name,
            address,
            is_default ? 1 : 0
        ]);


        res.send("ok");

    } catch (error) {

        res.status(500).send(error.message);

    }

};


// ========================================
// LẤY DANH SÁCH ĐỊA CHỈ
// ========================================

// ========================================
// LẤY DANH SÁCH ĐỊA CHỈ
// ========================================

const getAddresses = async (req, res) => {

    try {

        // KIỂM TRA ĐĂNG NHẬP
        if (!req.session.user) {
            return res.status(401).send('Vui lòng đăng nhập');
        }

        const user_id = req.session.user.id;

        const [result] = await db.query(`
            SELECT
                address_id,
                user_id,
                fullname,
                phone,
                province_name,
                ward_name,
                address,
                is_default
            FROM user_addresses
            WHERE user_id = ?
            ORDER BY is_default DESC, address_id DESC
        `, [user_id]);

        res.json(result);

    } catch (error) {

        res.status(500).send(error.message);

    }

};

// ========================================
// SỬA ĐỊA CHỈ
// ========================================

const updateAddress = async (req, res) => {

    try {

        const user_id = req.session.user.id;

        const address_id = req.params.address_id;

        const {
            fullname,
            phone,
            province_name,
            ward_name,
            address,
            is_default
        } = req.body;


        // KIỂM TRA ĐỊA CHỈ CÓ THUỘC USER KHÔNG
        const [checkAddress] = await db.query(`
            SELECT address_id
            FROM user_addresses
            WHERE address_id = ?
            AND user_id = ?
        `, [
            address_id,
            user_id
        ]);


        if (checkAddress.length === 0) {

            return res.send('Địa chỉ không tồn tại');

        }


        // NẾU CHỌN MẶC ĐỊNH
        if (is_default) {

            const [checkDefault] = await db.query(`
                SELECT address_id
                FROM user_addresses
                WHERE user_id = ?
                AND is_default = 1
                AND address_id <> ?
            `, [
                user_id,
                address_id
            ]);


            if (checkDefault.length > 0) {

                return res.send(
                    'Không được phép tạo địa chỉ mặc định khác!'
                );

            }

        }


        // CẬP NHẬT
        await db.query(`
            UPDATE user_addresses
            SET
                fullname = ?,
                phone = ?,
                province_name = ?,
                ward_name = ?,
                address = ?,
                is_default = ?
            WHERE address_id = ?
            AND user_id = ?
        `, [
            fullname,
            phone,
            province_name,
            ward_name,
            address,
            is_default ? 1 : 0,
            address_id,
            user_id
        ]);


        res.send('ok');

    } catch (error) {

        res.status(500).send(error.message);

    }

};


// ========================================
// XÓA ĐỊA CHỈ
// ========================================

const deleteAddress = async (req, res) => {

    try {

        const user_id = req.session.user.id;

        const address_id = req.params.address_id;


        // KIỂM TRA ĐỊA CHỈ CÓ THUỘC USER KHÔNG
        const [checkAddress] = await db.query(`
            SELECT
                address_id,
                is_default
            FROM user_addresses
            WHERE address_id = ?
            AND user_id = ?
        `, [
            address_id,
            user_id
        ]);


        if (checkAddress.length === 0) {

            res.status(404).send('Địa chỉ không tồn tại');

            return;
        }


        // KHÔNG CHO XÓA ĐỊA CHỈ MẶC ĐỊNH
        if (Number(checkAddress[0].is_default) === 1) {

            res.status(400).send(
                'Không thể xóa địa chỉ mặc định'
            );

            return;
        }


        // XÓA ĐỊA CHỈ
        await db.query(`
            DELETE FROM user_addresses
            WHERE address_id = ?
            AND user_id = ?
        `, [
            address_id,
            user_id
        ]);


        res.send('ok');

    } catch (error) {

        res.status(500).send(error.message);

    }

};


module.exports = {
    createAddress,
    getAddresses,
    updateAddress,
    deleteAddress
};
