const express = require('express');

const router = express.Router();

const {
    sendMessage,
    sendImage,
    getMessages,
    sendFile
} = require('../controllers/chatController');


router.post('/chat/send', sendMessage);
router.post('/chat/send-image', sendImage);
router.post('/chat/send-file', sendFile);
router.get('/chat/messages', getMessages);


module.exports = router;