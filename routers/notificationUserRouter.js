const express = require("express");

const router =
    express.Router();


const {
    getUserNotifications,
    readUserNotification,
    deleteUserNotification,
    readAllUserNotifications
} = require("../controllers/notificationUserController");


router.get(
    "/user-notifications",
    getUserNotifications
);


router.put(
    "/user-notifications/:id/read",
    readUserNotification
);


router.put(
    "/user-notifications/read-all",
    readAllUserNotifications
);


router.delete(
    "/user-notifications/:id",
    deleteUserNotification
);


module.exports = router;