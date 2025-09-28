const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");

const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, text } = req.body;
    console.log("sendMessage called with:", req.body);

    // Validate
    if (!conversationId || !senderId || !text) {
      return res.status(400).json({ error: "conversationId, senderId and text are required" });
    }

    // 1️⃣ Create message
    const message = await Message.create({
      conversationId,
      senderId,
      text
    });

    // 2️⃣ Update conversation lastMessage & updatedAt
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      updatedAt: Date.now()
    });

    // 3️⃣ Optional: emit to Socket.IO room (if using real-time)
    // io.to(conversationId).emit("newMessage", message);

    res.status(201).json(message);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Fetch all messages for the conversation, oldest first
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("senderId", "name email");

    res.json(messages);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { sendMessage, getAllMessages };
