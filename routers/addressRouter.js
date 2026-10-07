const express = require('express');
const router = express.Router();

const {
    createAddress,
    getAddresses,
    updateAddress,
    deleteAddress
} = require('../controllers/addressController');

router.post('/addresses', createAddress);
router.get('/getaddresses', getAddresses);
router.put('/addresses/:address_id', updateAddress);
router.delete('/addresses/:address_id', deleteAddress);

module.exports = router;