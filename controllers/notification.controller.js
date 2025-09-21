
const admin = require('firebase-admin');
const jwt = require("jsonwebtoken");
require("dotenv").config();

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString("utf8"));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const sendNotification = async (req, res) => {
    try {
        const { token, title, body, data } = req.body;
        const response = await notificationHandler(token, title, body, data);
        res.json({ message: 'Notification sent', response });
        // Simulate sending notification (e.g., via email or push notification)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

const notificationHandler = async (token, title, body, data = {}) => {
  if (!token || !title || !body) {
      throw new Error('token, title, body required');
  }
  const message ={
    notification: { title, body },
    data: data || {}, token
  }
  const response = await admin.messaging().send(message);
  console.log('Notification sent successfully:', response);
  return response;
}

module.exports = { sendNotification, notificationHandler };