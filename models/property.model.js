const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    propertyType: {
      type: String,
      enum: ["Flat", "Room", "PG", "House", "Hostel", "Other"],
      required: true,
    },
    bhkType: {
      type: String,
      enum: ["1RK", "1BHK", "2BHK", "3BHK", "4BHK+"],
      default: "1RK",
    },
    rent: {
      type: Number,
      required: true,
    },
    deposit: {
      type: Number,
      default: 0,
    },
    furnishing: {
      type: String,
      enum: ["Unfurnished", "Semi-Furnished", "Fully-Furnished"],
      default: "Unfurnished",
    },
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    address: {
      buildingName: { type: String, trim: true },  // 🏢 Added field
      street: { type: String, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      pincode: { type: String, trim: true },
      landmark: { type: String, trim: true },
    },
    amenities: [
      {
        type: String,
        enum: [
          "Parking",
          "WiFi",
          "AC",
          "Power Backup",
          "Lift",
          "Water Supply",
          "Security",
          "Gym",
          "Swimming Pool",
          "Other",
        ],
      },
    ],
    images: [
      {
        url: String,
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    contactPreference: {
      type: String,
      enum: ["Phone", "Chat", "Both"],
      default: "Both",
    },
  },
  { timestamps: true }
);

module.exports =  mongoose.model("Property", propertySchema);
