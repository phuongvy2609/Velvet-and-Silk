const express = require ('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const isAdmin = require('../middleware/isAdmin');


router.get('/dashboard', isAdmin, getDashboard);



module.exports = router;