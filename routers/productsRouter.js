//Nạp thư viện Express vào biến để sử dụng các tính năng của nó.
const express = require('express'); 
const multer = require('multer');

//Tạo một đối tượng Router con để quản lý các đường dẫn (URL) riêng biệt của ứng dụng.
const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, "assets/images");},
    filename: function (req, file, cb) {cb(null, Date.now() + "-" + file.originalname);}

});

const upload = multer({storage: storage});

const {
    getAllproducts, 
    getProductById, 
    deleteProduct, 
    addProduct, 
    updateProduct, 
    getProductsByCategory, 
    searchProducts, 
    getRandomProducts,
    getBestSellingProducts
} = require ('../controllers/productsController');
const isAdmin = require('../middleware/isAdmin');


//người dùng truy cập vào đường dẫn /getproducts, hàm getAllproducts sẽ được thực thi.
router.get('/getproducts', getAllproducts);
router.get('/products/random', getRandomProducts);
router.get('/products/bestselling', getBestSellingProducts);
router.get('/products/:id', getProductById);
router.post('/deleteproduct', isAdmin, deleteProduct);
router.post('/addproduct', isAdmin, upload.single("image"), addProduct);
router.post('/updateproduct/:id', isAdmin, upload.single("image"),updateProduct);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/search/:keyword', searchProducts);




module.exports = router; //Xuất đối tượng Router này ra để file chính