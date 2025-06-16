const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listing');
const { verifyJWT, requireRole } = require('../middlewares/auth');

// Public routes
router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListing);

// Protected routes (host only)
router.post('/', verifyJWT, requireRole('host'), listingController.createListing);
router.put('/:id', verifyJWT, requireRole('host'), listingController.editListing);
router.delete('/:id', verifyJWT, requireRole('host'), listingController.deleteListing);

module.exports = router;
