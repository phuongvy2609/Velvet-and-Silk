const { sql } = require('../config/db');

const getDashboard = async (req, res) => {

    try {

        // =========================
        // 1. TỔNG SẢN PHẨM
        // =========================

        const products = await sql.query`
            SELECT COUNT(*) AS total
            FROM Products
        `;


        // =========================
        // 2. TỔNG ĐƠN HÀNG
        // =========================

        const orders = await sql.query`
            SELECT COUNT(*) AS total
            FROM Orders
        `;


        // =========================
        // 3. TỔNG ĐÁNH GIÁ
        // =========================

        const reviews = await sql.query`
            SELECT COUNT(*) AS total
            FROM Reviews
        `;


        // =========================
        // 4. TỔNG PHẢN HỒI
        // =========================

        const contacts = await sql.query`
            SELECT COUNT(*) AS total
            FROM contact
        `;


        // =========================
        // 5. DOANH THU THEO THÁNG
        // =========================
        // Chỉ tính những đơn đã hoàn thành
        // trong năm hiện tại

        const revenue = await sql.query`
            SELECT
                MONTH(created_at) AS month,
                SUM(total) AS revenue
            FROM Orders
            WHERE status = N'Hoàn thành'
            AND YEAR(created_at) = YEAR(GETDATE())
            GROUP BY MONTH(created_at)
            ORDER BY MONTH(created_at)
        `;


        // =========================
        // 6. THỐNG KÊ TRẠNG THÁI ĐƠN HÀNG
        // =========================

        const orderStatus = await sql.query`
            SELECT
                status,
                COUNT(*) AS total
            FROM Orders
            GROUP BY status
        `;


        // =========================
        // 7. SẢN PHẨM BÁN CHẠY
        // =========================

        const topProducts = await sql.query`
            SELECT TOP 5
                product_name,
                image,
                SUM(quantity) AS sold,
                SUM(price * quantity) AS revenue
            FROM Cart
            WHERE order_id IS NOT NULL
            GROUP BY
                product_name,
                image
            ORDER BY SUM(quantity) DESC
        `;


        // =========================
        // TRẢ DỮ LIỆU
        // =========================

        res.json({

            products: products.recordset[0].total,

            orders: orders.recordset[0].total,

            reviews: reviews.recordset[0].total,

            contacts: contacts.recordset[0].total,

            revenue: revenue.recordset,

            orderStatus: orderStatus.recordset,

            topProducts: topProducts.recordset

        });

    }

    catch (err) {
        res.status(500).send(err.message);
    }
};


module.exports = {
    getDashboard
};