const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["owner", "tenant"],
      required: true, // signup के समय user select करेगा
    },
    fcmToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports =  mongoose.model("User", userSchema);
