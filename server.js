
const express = require('express');
const session = require('express-session');
const app = express();

// KẾT NỐI MYSQL
const { connectDB } = require('./config/db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CẤU HÌNH SESSION
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));

// KIỂM TRA USER ĐANG ĐĂNG NHẬP
app.get('/get-user', (req, res) => {
    res.json({
        user: req.session.user || null
    });
});

// THƯ MỤC UPLOAD ẢNH
app.use("/uploads", express.static("uploads"));

// THƯ MỤC FRONTEND
app.use(express.static('assets'));

// KHAI BÁO ROUTER
const authRouter = require('./routers/authRouter');
app.use('/', authRouter);

const productRouter = require('./routers/productsRouter');
app.use('/', productRouter);

const contactRouter = require('./routers/contactRouter');
app.use('/', contactRouter);

const reviewRouter = require('./routers/reviewRouter');
app.use('/', reviewRouter);

const orderRouter = require('./routers/orderRouter');
app.use('/', orderRouter);

const cartRouter = require('./routers/cartRouter');
app.use('/', cartRouter);

const dashboardRouter = require('./routers/dashboardRouter');
app.use('/', dashboardRouter);

const chatRouter = require('./routers/chatRouter');
app.use('/', chatRouter);

const messRouter = require('./routers/messRouter');
app.use('/chat', messRouter);

const voucherRouter = require('./routers/voucherRouter');
app.use('/', voucherRouter);

const addressRouter = require('./routers/addressRouter');
app.use('/', addressRouter);

const notificationRouter = require('./routers/notificationRouter');
app.use('/', notificationRouter);

const notificationUserRouter = require('./routers/notificationUserRouter');
app.use('/', notificationUserRouter);

// ========================================
// KHỞI ĐỘNG SERVER SAU KHI KẾT NỐI MYSQL
// ========================================

const PORT = process.env.PORT || 3000;

async function startServer() {

    try {

        await connectDB();

        app.listen(PORT, () => {

            console.log(`Server đã sẵn sàng tại cổng ${PORT}`);

        });

    } catch (error) {

        console.log("Không thể khởi động server!");

    }

}

startServer();
