const express = require("express");
const { sendMessage, getAllMessages } = require("../controllers/message.controller");
const router = express.Router();

router.post("/message", sendMessage);
router.get("/message/:conversationId", getAllMessages);

module.exports = router;