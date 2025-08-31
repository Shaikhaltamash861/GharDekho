const express = require('express');
const { signup, login, getProfile } = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/authmiddleware');
const router = express.Router();

router.post('/signup',signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;