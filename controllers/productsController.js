
const { db } = require('../config/db');

// LẤY TẤT CẢ SẢN PHẨM
const getAllproducts = async (req, res) => {
    try {
        const [kq] = await db.query(`
            SELECT 
                product_id,
                product_name,
                price,
                price_old,
                discount_percent,
                image,
                description,
                category,
                stock_quantity
            FROM products
        `);

        res.json(kq);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// LẤY SẢN PHẨM THEO ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const [kq] = await db.query(`
            SELECT *
            FROM products
            WHERE product_id = ?
        `, [id]);

        res.json(kq[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// LẤY SẢN PHẨM THEO PHÂN LOẠI
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const [kq] = await db.query(`
            SELECT 
                product_id,
                product_name,
                price,
                price_old,
                discount_percent,
                image,
                description,
                category,
                stock_quantity
            FROM products
            WHERE category = ?
        `, [category]);

        res.json(kq);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// THÊM SẢN PHẨM
const addProduct = async (req, res) => {
    try {
        const {
            product_name,
            price,
            price_old,
            stock_quantity,
            description,
            category
        } = req.body;

        // Lấy tên file ảnh
        const image = req.file ? req.file.filename : null;

        // Kiểm tra ảnh
        if (!image) {
            return res.status(400).send("Chưa chọn hình ảnh!");
        }

        function convertPrice(price) {
            if (!price) {
                return null;
            }

            const value = String(price).replace(/[^\d]/g, "");

            return value ? Number(value) : null;
        }

        const newPrice = convertPrice(price);
        const newPriceOld = convertPrice(price_old);

        const discountPercent =
            newPriceOld && newPriceOld > newPrice
                ? Math.round((newPriceOld - newPrice) * 100 / newPriceOld)
                : 0;

        // Lấy ID mới
        const [result] = await db.query(`
            SELECT IFNULL(MAX(product_id), 0) + 1 AS new_id
            FROM products
        `);

        const newProductId = result[0].new_id;

        // Thêm sản phẩm
        await db.query(`
            INSERT INTO products
            (
                product_id,
                product_name,
                price,
                price_old,
                discount_percent,
                image,
                description,
                category,
                stock_quantity
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            newProductId,
            product_name,
            newPrice,
            newPriceOld,
            discountPercent,
            image,
            description,
            category,
            stock_quantity
        ]);

        res.send("ok");
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// SỬA SẢN PHẨM
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            product_name,
            price,
            price_old,
            stock_quantity,
            description,
            category
        } = req.body;

        function convertPrice(price) {
            if (!price) {
                return null;
            }

            const value = String(price).replace(/[^\d]/g, "");

            return value ? Number(value) : null;
        }

        const newPrice = convertPrice(price);
        const newPriceOld = convertPrice(price_old);

        const discountPercent =
            newPriceOld && newPriceOld > newPrice
                ? Math.round((newPriceOld - newPrice) * 100 / newPriceOld)
                : 0;

        // Nếu có chọn ảnh mới
        if (req.file) {
            const image = req.file.filename;

            await db.query(`
                UPDATE products
                SET
                    product_name = ?,
                    price = ?,
                    price_old = ?,
                    discount_percent = ?,
                    stock_quantity = ?,
                    image = ?,
                    description = ?,
                    category = ?
                WHERE product_id = ?
            `, [
                product_name,
                newPrice,
                newPriceOld,
                discountPercent,
                stock_quantity,
                image,
                description,
                category,
                id
            ]);
        }

        // Nếu không chọn ảnh mới
        else {
            await db.query(`
                UPDATE products
                SET
                    product_name = ?,
                    price = ?,
                    price_old = ?,
                    discount_percent = ?,
                    stock_quantity = ?,
                    description = ?,
                    category = ?
                WHERE product_id = ?
            `, [
                product_name,
                newPrice,
                newPriceOld,
                discountPercent,
                stock_quantity,
                description,
                category,
                id
            ]);
        }

        res.send("ok");
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// XÓA SẢN PHẨM
const deleteProduct = async (req, res) => {
    const { id } = req.body;

    try {
        await db.query(`
            DELETE FROM products
            WHERE product_id = ?
        `, [id]);

        res.send("ok");
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// TÌM KIẾM SẢN PHẨM
const searchProducts = async (req, res) => {
    try {
        const keyword = req.params.keyword;

        const [result] = await db.query(`
            SELECT *
            FROM products
            WHERE product_name LIKE ?
        `, [`%${keyword}%`]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


// LẤY SẢN PHẨM NGẪU NHIÊN
const getRandomProducts = async (req, res) => {
    try {
        const [kq] = await db.query(`
            SELECT
                product_id,
                product_name,
                price,
                price_old,
                discount_percent,
                image,
                description,
                category,
                stock_quantity
            FROM products
            ORDER BY RAND()
            LIMIT 10
        `);

        res.json(kq);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// LẤY SẢN PHẨM BÁN CHẠY
const getBestSellingProducts = async (req, res) => {
    try {
        const [kq] = await db.query(`
            SELECT
                p.product_id,
                p.product_name,
                p.price,
                p.price_old,
                p.discount_percent,
                p.image,
                p.description,
                p.category,
                p.stock_quantity,
                SUM(c.quantity) AS total_sold
            FROM Cart c
            INNER JOIN Orders o
                ON c.order_id = o.order_id
            INNER JOIN products p
                ON c.product_name = p.product_name
            WHERE c.order_id IS NOT NULL
                AND o.status <> 'Đã hủy'
            GROUP BY
                p.product_id,
                p.product_name,
                p.price,
                p.price_old,
                p.discount_percent,
                p.image,
                p.description,
                p.category,
                p.stock_quantity
            ORDER BY total_sold DESC
            LIMIT 10
        `);

        res.json(kq);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


module.exports = {
    getAllproducts,
    getProductById,
    deleteProduct,
    addProduct,
    updateProduct,
    getProductsByCategory,
    searchProducts,
    getRandomProducts,
    getBestSellingProducts
};
