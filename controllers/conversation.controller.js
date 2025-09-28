const Conversation = require("../models/conversation.model");

const getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id; // logged-in user
    const {
      page = 1,
      limit = 10,
      status,          // filter by contact request status
      contactedVia,    // filter by contactedVia (Phone, Chat, Email)
      propertyTitle    // filter by property title
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Build contactRequest filter
    const contactRequestFilter = {};
    if (status) contactRequestFilter.status = status;
    if (contactedVia) contactRequestFilter.contactedVia = contactedVia;

    // If filtering by property title
    if (propertyTitle) {
      contactRequestFilter['propertyId.title'] = { $regex: propertyTitle, $options: 'i' };
    }

    // Total count for pagination
    const total = await Conversation.countDocuments({ participants: userId })
      .populate({
        path: "contactRequestId",
        match: contactRequestFilter
      });

    // Query conversations with pagination
    const conversations = await Conversation.find({ participants: userId })
      .sort({ updatedAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("participants", "name email role")
      .populate({
        path: "contactRequestId",
        match: contactRequestFilter,
        select: "propertyId status contactedVia",
        populate: {
          path: "propertyId",
          select: "title address"
        }
      });

    // Remove conversations where contactRequest did not match filter
    const filteredConversations = conversations.filter(c => c.contactRequestId);

    res.json({
      total: filteredConversations.length,
      page: pageNum,
      pages: Math.ceil(filteredConversations.length / limitNum),
      conversations: filteredConversations
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getMyConversations };