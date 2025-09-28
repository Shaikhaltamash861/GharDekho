const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  contactRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ContactRequest",
    required: true, // links conversation to a contact request
  },
  participants: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", // owner + tenant
      required: true 
    }
  ],
  lastMessage: {
    type: String,
    default: ""
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);
