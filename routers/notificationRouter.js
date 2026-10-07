const express = require("express");

const router = express.Router();


const {
    getNotifications,
    getUnreadNotificationCount,
    readNotification,
    deleteNotification
} = require("../controllers/notificationController");


// ========================================
// LẤY DANH SÁCH THÔNG BÁO
// ========================================

router.get(
    "/notifications",
    getNotifications
);


// ========================================
// ĐẾM THÔNG BÁO CHƯA ĐỌC
// ========================================

router.get(
    "/notifications/unread-count",
    getUnreadNotificationCount
);


// ========================================
// ĐÁNH DẤU THÔNG BÁO ĐÃ ĐỌC
// ========================================

router.put(
    "/notifications/:id/read",
    readNotification
);

router.delete(
    "/notifications/:id",
    deleteNotification
);



module.exports = router;