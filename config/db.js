
require('dotenv').config();

const mysql = require('mysql2/promise');

const db = mysql.createPool({

    host: process.env.DB_SERVER,

    port: Number(process.env.DB_PORT || 4000),

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_DATABASE,

    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    },

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0,

    timezone: '+07:00'

});


// ========================================
// KIỂM TRA KẾT NỐI MYSQL
// ========================================

async function connectDB() {

    try {

        const connection = await db.getConnection();

        console.log("Kết Nối MySQL Thành Công!");

        connection.release();

    } catch (err) {

        console.log("Lỗi kết nối MySQL:", err.message);

        throw err;

    }

}

module.exports = {
    db,
    connectDB
};
