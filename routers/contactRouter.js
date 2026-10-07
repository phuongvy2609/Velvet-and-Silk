const express = require("express");

const router = express.Router();

const {
    sendContact,
    getContact,
    deleteContact,
    readContact,
    sendMail,
    createContactReplyNotification
} = require("../controllers/contactController");

const isAdmin = require("../middleware/isAdmin");


router.post(
    "/sendContact",
    sendContact
);


router.get(
    "/getContact",
    isAdmin,
    getContact
);


router.delete(
    "/deleteContact",
    isAdmin,
    deleteContact
);


router.put(
    "/readContact",
    isAdmin,
    readContact
);


router.post(
    "/send-mail",
    isAdmin,
    sendMail
);

router.post("/create-contact-reply-notification", createContactReplyNotification);
module.exports = router;