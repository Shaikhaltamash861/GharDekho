const express = require('express');
const app = express();
const { mongoDB } = require('./configs/db');
const userRoutes  = require('./routes/user.routes');
const propertyroutes = require('./routes/property.routes');
const contactReqRoutes = require('./routes/contact-req.routes');
const imageUploadRoutes = require('./routes/image-upload.route');
mongoDB();
require('dotenv').config()
const PORT = process.env.PORT || 3000;



app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', propertyroutes);
app.use('/api', contactReqRoutes);
app.use('/api', imageUploadRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});