const User = require("../models/user.model");

// Update FCM Token
const getFcmToken = async (id) => {
    try {
        const user = await User.findById(id);
        return user.fcmToken;
    } catch (error) {
        console.error("Error fetching FCM token:", error);
        return null;
    }
}
module.exports = getFcmToken;