const mongoose = require("mongoose");

const contactRequestSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    contactedVia: {
      type: String,
      enum: ["Phone", "Chat", "Email", "None"],
      default: "None",
    },
    phone:{
        type: String,
        required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactRequest", contactRequestSchema);
