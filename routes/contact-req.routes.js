const express = require('express');
const { createContactRequest, deleteContactRequest, getAllContactRequests, updateContactRequest } = require('../controllers/contact-request.controller');
const { authMiddleware, authorize } = require('../middlewares/authmiddleware');
const router = express.Router();


router.post('/contact-request',authMiddleware, authorize('tenant'), createContactRequest);
router.get('/contact-request',authMiddleware,getAllContactRequests);
router.delete('/contact-request/:id',authMiddleware,authorize('tenant'), deleteContactRequest);
router.put('/contact-request/:id',authMiddleware, updateContactRequest);

module.exports = router;