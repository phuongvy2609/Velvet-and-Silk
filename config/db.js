require('dotenv').config();

const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        trustServerCertificate: true
    }
};

async function connectDB() {

    try {
        await sql.connect(config);
        console.log("Kết Nối Thành Công !");
    }

    catch (err) {
        console.log("Lỗi", err);
    }

}

module.exports = { sql, connectDB };