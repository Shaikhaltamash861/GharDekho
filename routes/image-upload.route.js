const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { uploadImages } = require('../controllers/image-upload.controller');
const { authMiddleware, authorize } = require('../middlewares/authmiddleware');

router.post('/upload-image',authMiddleware, authorize('owner'), upload.array('image',10), uploadImages);

module.exports = router;