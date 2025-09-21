const ContactRequest = require("../models/contact-req.model");
const Property = require("../models/property.model");
const getFcmToken = require("../utils/getFCM");
const { notificationHandler } = require("./notification.controller");

// Create new contact request
const createContactRequest = async (req, res) => {
   try {
    const { propertyId, message, phone } = req.body;
    const requesterId = req.user.id; // from auth middleware

    // 1. Check if property exists
    const property = await Property.findById(propertyId).select("ownerId");
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const ownerId = property.ownerId;

    // 2. Check if a pending request already exists
    const existingRequest = await ContactRequest.findOne({
      propertyId,
      requesterId,
      status: "Pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        error: "You already have a pending request for this property",
      });
    }

    // 3. Create new request
    const newRequest = new ContactRequest({
      propertyId,
      requesterId,
      ownerId,
      message,
      phone,
    });

    await newRequest.save();
    const fcmToken = await getFcmToken(ownerId);
    notificationHandler(fcmToken, "New Contact Request", `You have a new contact request for your property.`);


    console.log("Owner FCM Token:", fcmToken);

    res.status(201).json({
      message: "Contact request sent successfully",
      request: newRequest,
    });
  } catch (err) {
    console.error("Error creating contact request:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all contact requests (admin / owner)
const getAllContactRequests = async (req, res) => {
    try {
    const { page = 1, limit = 10, status } = req.query;
    const { role, id: userId } = req.user;

    // Base filter
    const filter = {};
    if (status) filter.status = status;

    // Role-based restrictions
    if (role === "tenant") {
      filter.requesterId = userId; // tenant can only see their requests
    } else if (role === "owner") {
      filter.ownerId = userId; // owner can only see requests to their properties
    } else if (role !== "admin") {
      return res.status(403).json({ success: false, error: "Forbidden: role not allowed" });
    }

    // Fetch paginated, sorted requests
    const requests = await ContactRequest.find(filter)
      .populate("propertyId", "title rent address")
      .populate("requesterId", "name email phone")
      .populate("ownerId", "name email phone")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ContactRequest.countDocuments(filter);

    res.json({
      success: true,
      data: requests,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching contact requests:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Get single contact request
const getContactRequestById = async (req, res) => {
    try {
        const request = await ContactRequest.findById(req.params.id)
            .populate("propertyId", "title rent address")
            .populate("requesterId", "name email phone")
            .populate("ownerId", "name email phone");

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        res.json({ success: true, data: request });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update status of contact request (owner only)
const updateContactRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, phone, status, contactedVia } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    const request = await ContactRequest.findById(id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    // Only pending requests can be updated
    if (request.status !== "Pending") {
      return res.status(400).json({ error: "Only pending requests can be updated" });
    }

    if (role === "tenant") {
      if (request.requesterId.toString() !== userId) {
        return res.status(403).json({ error: "Not authorized to update this request" });
      }

      if (message) request.message = message;
      if (phone) request.phone = phone;
      if (contactedVia) request.contactedVia = contactedVia;

    } else if (role === "owner") {
      if (request.ownerId.toString() !== userId) {
        return res.status(403).json({ error: "Not authorized to update this request" });
      }

      if (status && ["Accepted", "Rejected"].includes(status)) {
        request.status = status;
      } else {
        return res.status(400).json({ error: "Owner can only update status (Accepted/Rejected)" });
      }
    }

    await request.save();
    res.json({ message: "Request updated", request });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


// Delete contact request (optional)
const deleteContactRequest = async (req, res) => {
    try {
        const request = await ContactRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        // Owner or requester can delete
        if (
            request.ownerId.toString() !== req.user.id &&
            request.requesterId.toString() !== req.user.id
        ) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        await request.deleteOne();
        res.json({ success: true, message: "Contact request deleted" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = {
    createContactRequest,
    getAllContactRequests,
    getContactRequestById,
    updateContactRequest,
    deleteContactRequest,
};
