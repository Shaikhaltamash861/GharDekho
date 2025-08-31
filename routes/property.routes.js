const express = require('express');
const router = express.Router();
const { addProperty, getAllProperties, getPropertyById, updateProperty, deleteProperty} = require('../controllers/property.controller');
const { authMiddleware, authorize } = require('../middlewares/authmiddleware');


router.post('/property',authMiddleware, authorize('owner'),addProperty);
router.get('/properties',getAllProperties);
router.get('/property/:id',getPropertyById);
router.put('/property/:id',authMiddleware,authorize('owner'), updateProperty);
router.delete('/property/:id',authMiddleware,authorize('owner'),deleteProperty);

module.exports = router;