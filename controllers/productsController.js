//Nhập đối tượng kết nối cơ sở dữ liệu từ file cấu hình của bạn.
const { sql } = require('../config/db');

const getAllproducts = async (req, res) => { //Khai báo hàm xử lý bất đồng bộ để lấy dữ liệu
    try { //chạy code trong try, nếu lỗi thì nhảy xuống catch để xử lý, tránh sập server.
        const kq = await sql.query`
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
        `; //Gửi lệnh SQL để lấy toàn bộ dữ liệu từ bảng products và 
        //đợi (await) cho đến khi có kết quả.

        res.json(kq.recordset); //Lấy danh sách dữ liệu (recordset) 
        // trả về cho phía người dùng dưới định dạng JSON.
    }

    catch (err) {
        res.status(500).send(err.message);
    } //Nếu lỗi, trả về mã trạng thái 500 (lỗi hệ thống) kèm nội dung thông báo lỗi.
}


// Hàm xử lý để lấy thông tin sản phẩm theo ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params; // Lấy giá trị id từ tham số URL
        const kq = await sql.query`
            SELECT * 
            FROM products 
            WHERE product_id = ${id} 
        `; // Gửi lệnh SQL để lấy dữ liệu sản phẩm theo id và đợi kết quả

        res.json(kq.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// LẤY SẢN PHẨM THEO PHÂN LOẠI
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const kq = await sql.query`
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
            WHERE category = ${category}
        `;

        res.json(kq.recordset);

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
        const image = req.file ? req.file.filename : null

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

        // Lấy ID mới
        const result = await sql.query`
            SELECT ISNULL(MAX(product_id), 0) + 1 AS new_id
            FROM products
        `;

        const newProductId = result.recordset[0].new_id;

        // Thêm sản phẩm
        await sql.query`
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
            VALUES
            (
                ${newProductId},
                ${product_name},
                ${newPrice},
                ${newPriceOld},
                ${newPriceOld && newPriceOld > newPrice
                ? Math.round((newPriceOld - newPrice) * 100 / newPriceOld)
                : 0
            },
                ${image},
                ${description},
                ${category},
                ${stock_quantity}
            )
        `;

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
            const value =
                String(price).replace(/[^\d]/g, "");
            return value ? Number(value) : null;
        }

        const newPrice = convertPrice(price);
        const newPriceOld = convertPrice(price_old);

        // Nếu có chọn ảnh mới
        if (req.file) {
            const image = req.file.filename;

            await sql.query`
                UPDATE products
                SET
                    product_name = ${product_name},
                    price = ${newPrice},
                    price_old = ${newPriceOld},
                    discount_percent = ${newPriceOld && newPriceOld > newPrice
                    ? Math.round((newPriceOld - newPrice) * 100 / newPriceOld)
                    : 0
                },
                    stock_quantity = ${stock_quantity},
                    image = ${image},
                    description = ${description},
                    category = ${category}
                WHERE product_id = ${id}
            `;

        }


        // Nếu ko chọn ảnh mới
        else {
            await sql.query`
                UPDATE products
                SET
                    product_name = ${product_name},
                    price = ${newPrice},
                    price_old = ${newPriceOld},
                    discount_percent = ${newPriceOld && newPriceOld > newPrice
                    ? Math.round((newPriceOld - newPrice) * 100 / newPriceOld)
                    : 0
                },
                    stock_quantity = ${stock_quantity},
                    description = ${description},
                    category = ${category}
                WHERE product_id = ${id}
            `;
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
        await sql.query`
            DELETE FROM products
            WHERE product_id = ${id}
        `;
        res.send("ok");
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// TÌM KIẾM SẢN PHẨM
const searchProducts = async (req, res) => {
    try {
        const keyword = req.params.keyword;
        const result = await sql.query`
            SELECT *
            FROM products
            WHERE product_name LIKE ${'%' + keyword + '%'}
        `;
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


const getRandomProducts = async (req, res) => {
    try {
        const kq = await sql.query`
            SELECT TOP 10
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
            ORDER BY NEWID()
        `;

        res.json(kq.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// ========================================
// LẤY SẢN PHẨM BÁN CHẠY
// ========================================

const getBestSellingProducts = async (req, res) => {
    try {

        const kq = await sql.query`
            SELECT TOP 10
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
                AND o.status <> N'Đã hủy'

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
        `;

        res.json(kq.recordset);

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
//Xuất hàm này ra để các file khác trong dự án có thể sử dụng được.


