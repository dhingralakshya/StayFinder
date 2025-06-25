const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listing');
const { verifyJWT, requireRole } = require('../middlewares/auth');

// Public routes
router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListing);

// Protected routes (host only)
router.get('/host/listing', verifyJWT, requireRole('host'), listingController.getListingsByHost);
router.post('/', verifyJWT, requireRole('host'), listingController.createListing);
router.patch('/:id', verifyJWT, requireRole('host'), listingController.editListing);
router.delete('/:id', verifyJWT, requireRole('host'), listingController.deleteListing);

module.exports = router;
