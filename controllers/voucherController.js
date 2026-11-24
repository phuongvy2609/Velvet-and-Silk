// ========================================
// KẾT NỐI DATABASE
// ========================================

const { db } = require("../config/db");


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

        const startDate = start_date ? start_date.split("T")[0] : null;
        const endDate = end_date ? end_date.split("T")[0] : null;

        // Kiểm tra mã voucher đã tồn tại
        const [check] = await db.query(
            "SELECT voucher_id FROM Vouchers WHERE voucher_code = ?",
            [voucher_code]
        );

        if (check.length > 0) {
            return res.status(400).send("Mã voucher này đã tồn tại, vui lòng chọn mã khác!");
        }

        // Thêm voucher
        await db.query(`
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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            voucher_code,
            voucher_type,
            Number(voucher_value),
            Number(min_order),
            startDate,
            endDate,
            Number(quantity),
            status
        ]);

        res.send("ok");

    } catch (error) {
        res.status(500).send(error.sqlMessage || error.message);
    }
};


// ========================================
// LẤY DANH SÁCH VOUCHER
// ========================================

const getVouchers = async (req, res) => {

    try {

        const [result] = await db.query(`

            SELECT *
            FROM Vouchers
            ORDER BY voucher_id DESC

        `);


        res.json(result);

    }

    catch (error) {
        res.status(500).send(error.sqlMessage || error.message);
    }

};


// ========================================
// SỬA VOUCHER
// ========================================

const updateVoucher = async (req, res) => {

    try {

        const id = req.params.id;


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


        // ĐỔI DATETIME-LOCAL SANG DATETIME MYSQL

        const startDate = start_date ? start_date.split("T")[0] : null;
        const endDate = end_date ? end_date.split("T")[0] : null;


        // CẬP NHẬT VOUCHER

        await db.query(`

            UPDATE Vouchers

            SET

                voucher_code = ?,

                voucher_type = ?,

                voucher_value = ?,

                min_order = ?,

                start_date = ?,

                end_date = ?,

                quantity = ?,

                status = ?

            WHERE voucher_id = ?

        `, [

            voucher_code,
            voucher_type,
            Number(voucher_value),
            Number(min_order),
            startDate,
            endDate,
            Number(quantity),
            status,
            id

        ]);


        res.send("ok");

    }

    catch (error) {
        res.status(500).send(error.sqlMessage || error.message);
    }

};


// ========================================
// XÓA VOUCHER
// ========================================

const deleteVoucher = async (req, res) => {

    try {

        const id = req.params.id;


        await db.query(`

            DELETE FROM Vouchers

            WHERE voucher_id = ?

        `, [id]);


        res.send("ok");

    }

    catch (error) {
        res.status(500).send(error.sqlMessage || error.message);
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


        // KHÔNG CÓ VOUCHER

        if (!voucher_code) {

            res.send("ok");

            return;

        }


        // TRỪ 1 VOUCHER

        await db.query(`

            UPDATE Vouchers

            SET quantity = quantity - 1

            WHERE voucher_code = ?

            AND quantity > 0

        `, [voucher_code]);


        res.send("ok");

    }

    catch (error) {
        res.status(500).send(error.sqlMessage || error.message);
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