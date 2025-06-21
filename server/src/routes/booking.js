const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');
const { verifyJWT, requireRole } = require('../middlewares/auth');

//get all bookings
router.get('/', bookingController.getAllBookings);

// User's bookings (for guests)
router.get('/user', verifyJWT, bookingController.getBookingsByUser);

// Public: Get a single booking by ID
router.get('/:id', verifyJWT, bookingController.getBooking);

// Host: Get all bookings for a specific listing (host only)
router.get('/listing/:listingId', verifyJWT, requireRole('host'), bookingController.getBookingsByListing);

// Create a booking (any authenticated user)
router.post('/', verifyJWT, bookingController.createBooking);

// Cancel a booking (only the user who made it)
router.put('/:id/cancel', verifyJWT, bookingController.cancelBooking);

module.exports = router;
