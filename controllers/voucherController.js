// ========================================
// KẾT NỐI DATABASE
// ========================================

const { sql } = require("../config/db");


// ========================================
// THÊM VOUCHER
// ========================================

const addVoucher = async (req, res) => {

    try {

        const {
            voucher_code,
            voucher_type,
            voucher_value,
            min_order,
            start_date,
            end_date,
            quantity,
            status
        } = req.body;


        // ========================================
        // ĐỔI DATETIME-LOCAL SANG DATETIME SQL SERVER
        // ========================================

        const startDate =
            start_date
                ? start_date.replace("T", " ")
                : null;


        const endDate =
            end_date
                ? end_date.replace("T", " ")
                : null;


        // ========================================
        // THÊM VOUCHER
        // ========================================

        await sql.query(`

            INSERT INTO Vouchers
            (
                voucher_code,
                voucher_type,
                voucher_value,
                min_order,
                start_date,
                end_date,
                quantity,
                status
            )

            VALUES
            (
                '${voucher_code}',
                '${voucher_type}',
                ${Number(voucher_value)},
                ${Number(min_order)},
                '${startDate}',
                '${endDate}',
                ${Number(quantity)},
                '${status}'
            )

        `);


        res.send("ok");

    }

    catch (error) {

        res.status(500).send(error.message);

    }

};


// ========================================
// LẤY DANH SÁCH VOUCHER
// ========================================

const getVouchers = async (req, res) => {

    try {

        const result = await sql.query(`

            SELECT *
            FROM Vouchers
            ORDER BY voucher_id DESC

        `);


        res.json(
            result.recordset
        );

    }

    catch (error) {

        res.status(500).send(error.message);

    }

};


// ========================================
// SỬA VOUCHER
// ========================================

const updateVoucher = async (req, res) => {

    try {

        const id =
            req.params.id;


        const {
            voucher_code,
            voucher_type,
            voucher_value,
            min_order,
            start_date,
            end_date,
            quantity,
            status
        } = req.body;


        // ========================================
        // ĐỔI DATETIME-LOCAL SANG DATETIME SQL SERVER
        // ========================================

        const startDate =
            start_date
                ? start_date.replace("T", " ")
                : null;


        const endDate =
            end_date
                ? end_date.replace("T", " ")
                : null;


        // ========================================
        // CẬP NHẬT VOUCHER
        // ========================================

        await sql.query(`

            UPDATE Vouchers

            SET

                voucher_code = '${voucher_code}',

                voucher_type = '${voucher_type}',

                voucher_value = ${Number(voucher_value)},

                min_order = ${Number(min_order)},

                start_date = '${startDate}',

                end_date = '${endDate}',

                quantity = ${Number(quantity)},

                status = '${status}'

            WHERE voucher_id = ${id}

        `);


        res.send("ok");

    }

    catch (error) {

        res.status(500).send(error.message);

    }

};


// ========================================
// XÓA VOUCHER
// ========================================

const deleteVoucher = async (req, res) => {

    try {

        const id =
            req.params.id;


        await sql.query(`

            DELETE FROM Vouchers

            WHERE voucher_id = ${id}

        `);


        res.send("ok");

    }

    catch (error) {

        res.status(500).send(error.message);

    }

};


// ========================================
// TRỪ SỐ LƯỢNG VOUCHER SAU KHI THANH TOÁN
// ========================================

const decreaseVoucherQuantity = async (req, res) => {

    try {

        const {
            voucher_code
        } = req.body;


        // ========================================
        // KHÔNG CÓ VOUCHER
        // ========================================

        if (!voucher_code) {

            res.send("ok");

            return;

        }


        // ========================================
        // TRỪ 1 VOUCHER
        // ========================================

        await sql.query(`

            UPDATE Vouchers

            SET quantity = quantity - 1

            WHERE voucher_code = '${voucher_code}'

            AND quantity > 0

        `);


        res.send("ok");

    }

    catch (error) {

        res.status(500).send(error.message);

    }

};


// ========================================
// EXPORT
// ========================================

module.exports = {

    addVoucher,

    getVouchers,

    updateVoucher,

    deleteVoucher,

    decreaseVoucherQuantity

};