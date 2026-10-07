const express = require("express");
const router = express.Router();

const {
    getChatCustomers,
    getAdminMessages,
    adminSendMessage,
    adminSendImage,
    adminSendFile,
    getUnreadMessageCount,
    markMessagesAsRead,
    finishChat
} = require("../controllers/messController");

router.get("/admin/customers", getChatCustomers);
router.get("/admin/messages/:user_id", getAdminMessages);
router.post("/admin/send", adminSendMessage);
router.post("/admin/send-image", adminSendImage);
router.post("/admin/send-file", adminSendFile);
router.get("/admin/unread-count", getUnreadMessageCount);
router.put("/admin/messages/:user_id/read", markMessagesAsRead);
router.put("/admin/finish/:user_id", finishChat);

module.exports = router;