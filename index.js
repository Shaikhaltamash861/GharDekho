const express = require('express');
const app = express();
const cors = require('cors');
const { mongoDB } = require('./configs/db');
const userRoutes  = require('./routes/user.routes');
const propertyroutes = require('./routes/property.routes');
const contactReqRoutes = require('./routes/contact-req.routes');
const imageUploadRoutes = require('./routes/image-upload.route');
const conversationRoutes = require('./routes/conversation.routes');
const messageRoutes = require('./routes/message.routes');
mongoDB();
require('dotenv').config()
const PORT = process.env.PORT || 3000;



app.use(express.json());
app.use(cors());

app.use('/api', userRoutes);
app.use('/api', propertyroutes);
app.use('/api', contactReqRoutes);
app.use('/api', imageUploadRoutes);
app.use('/api', conversationRoutes);
app.use('/api', messageRoutes);
app.post('/api/notify', require('./controllers/notification.controller').sendNotification);

app.get('/', (req, res) => {
  res.send('Hello World!');
});
const HOST = '0.0.0.0';

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});