const express = require('express');
const router = express.Router();
const {register, login, getAlluser, deleteUser, getProfile, updateProfile, changePassword, logoutUser, logoutAdmin } = require('../controllers/authController');
const isAdmin = require('../middleware/isAdmin');


router.post('/dangky', register);//register phải giống file Controller.js
router.post('/dangnhap', login);
router.get('/getalluser', isAdmin, getAlluser);
router.delete('/deleteUser', isAdmin, deleteUser);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/logout-user', logoutUser);
router.post('/logout-admin', logoutAdmin);


module.exports = router;
