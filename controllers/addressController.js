const { sql } = require('../config/db');

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

            const checkDefault = await sql.query`
                SELECT address_id
                FROM user_addresses
                WHERE user_id = ${user_id}
                AND is_default = 1
            `;

            if (checkDefault.recordset.length > 0) {

                return res.send(
                    'Have'
                );

            }

        }


        // THÊM ĐỊA CHỈ
        await sql.query`
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
            VALUES
            (
                ${user_id},
                ${fullname},
                ${phone},
                ${province_name},
                ${ward_name},
                ${address},
                ${is_default ? 1 : 0}
            )
        `;


        res.send("ok");

    } catch (error) {

        res.status(500).send(error.message);

    }

};



// ========================================
// LẤY DANH SÁCH ĐỊA CHỈ
// ========================================

const getAddresses = async (req, res) => {

    try {

        const user_id = req.session.user.id;

        const result = await sql.query`
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
            WHERE user_id = ${user_id}
            ORDER BY is_default DESC, address_id DESC
        `;

        res.json(result.recordset);

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


        // ========================================
        // KIỂM TRA ĐỊA CHỈ CÓ THUỘC USER KHÔNG
        // ========================================

        const checkAddress = await sql.query`

            SELECT address_id

            FROM user_addresses

            WHERE address_id = ${address_id}

            AND user_id = ${user_id}

        `;


        if (checkAddress.recordset.length === 0) {

            return res.send(
                'Địa chỉ không tồn tại'
            );

        }


        // ========================================
        // NẾU CHỌN MẶC ĐỊNH
        // ========================================

        if (is_default) {

            const checkDefault = await sql.query`

                SELECT address_id

                FROM user_addresses

                WHERE user_id = ${user_id}

                AND is_default = 1

                AND address_id <> ${address_id}

            `;


            if (checkDefault.recordset.length > 0) {

                return res.send(
                    'Không được phép tạo địa chỉ mặc định khác!'
                );

            }

        }


        // ========================================
        // CẬP NHẬT
        // ========================================

        await sql.query`

            UPDATE user_addresses

            SET
                fullname = ${fullname},
                phone = ${phone},
                province_name = ${province_name},
                ward_name = ${ward_name},
                address = ${address},
                is_default = ${is_default ? 1 : 0}

            WHERE address_id = ${address_id}

            AND user_id = ${user_id}

        `;


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
        const checkAddress = await sql.query`
            SELECT
                address_id,
                is_default
            FROM user_addresses
            WHERE address_id = ${address_id}
            AND user_id = ${user_id}
        `;


        if (checkAddress.recordset.length === 0) {

            res.status(404).send('Địa chỉ không tồn tại');

            return;
        }


        // KHÔNG CHO XÓA ĐỊA CHỈ MẶC ĐỊNH
        if (Number(checkAddress.recordset[0].is_default) === 1) {

            res.status(400).send(
                'Không thể xóa địa chỉ mặc định'
            );

            return;
        }


        // XÓA ĐỊA CHỈ
        await sql.query`
            DELETE FROM user_addresses
            WHERE address_id = ${address_id}
            AND user_id = ${user_id}
        `;


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