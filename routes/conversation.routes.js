const express = require("express");
const router = express.Router();
const { getMyConversations } = require("../controllers/conversation.controller");
const { authMiddleware } = require("../middlewares/authmiddleware");

router.get("/conversations", authMiddleware, getMyConversations);

module.exports = router;