const express = require('express');
const session = require('express-session');
const app = express();
const { sql, connectDB } = require('./config/db'); 
connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình Session: Lưu thông tin người dùng vào bộ nhớ Server
app.use(session({
    secret: 'secret-key', 
    resave: false,
    saveUninitialized: true,
}));

// KIỂM TRA USER ĐANG ĐĂNG NHẬP
app.get('/get-user', (req, res) => {
    res.json({
        user: req.session.user || null //req.session.user → lấy user đã login || null → nếu không có thì trả null
    });
});

app.use("/uploads", express.static("uploads"));

// Chỉ định thư mục chứa file HTML, CSS, JS của bạn
app.use(express.static('assets'));

const authRouter = require('./routers/authRouter'); // Đăng ký router cho authRouter
app.use('/', authRouter);

const productRouter = require ('./routers/productsRouter'); // Đăng ký router cho productRouter
app.use('/', productRouter);

const contactRouter = require('./routers/contactRouter'); // Đăng ký router cho contactRouter
app.use('/',contactRouter);

const reviewRouter = require('./routers/reviewRouter'); // Đăng ký router cho reviewRouter
app.use('/', reviewRouter);

const orderRouter = require('./routers/orderRouter');   // Đăng ký router cho orderRouter
app.use('/', orderRouter);

const cartRouter = require('./routers/cartRouter'); // Đăng ký router cho cartRouter
app.use('/', cartRouter);

const dashboardRouter = require('./routers/dashboardRouter'); 
app.use('/', dashboardRouter);

const chatRouter = require('./routers/chatRouter');
app.use('/', chatRouter);

const messRouter = require("./routers/messRouter");
app.use('/chat', messRouter);

const voucherRouter = require('./routers/voucherRouter');
app.use('/', voucherRouter);

const addressRouter = require('./routers/addressRouter');
app.use('/', addressRouter);

const notificationRouter = require('./routers/notificationRouter');
app.use('/', notificationRouter);

const notificationUserRouter = require('./routers/notificationUserRouter');
app.use('/', notificationUserRouter);


// Chạy Server
app.listen(3000, () => {
    console.log('🚀 Server đã sẵn sàng tại: http://localhost:3000');
});