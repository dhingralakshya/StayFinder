'use strict';

const HttpErrors = require('../../errors/httpErrors');
const bookingService = require('../services/booking');

const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json(bookings);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// Get a single booking by ID
const getBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await bookingService.getBooking(id);
    if (!booking) throw new HttpErrors('Booking not found', 404);
    res.status(200).json(booking);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// Get all bookings for the logged-in user
const getBookingsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await bookingService.getBookingsByUser(userId);
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Get all bookings for a listing (host can use this)
const getBookingsByListing = async (req, res) => {
  try {
    const listingId = req.params.listingId;
    const bookings = await bookingService.getBookingsByListing(listingId);
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listingId, startDate, endDate, totalPrice } = req.body;
    const newBooking = await bookingService.createBooking(userId, listingId, startDate, endDate, totalPrice);
    res.status(201).json(newBooking);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// Cancel a booking (user can cancel their own booking)
const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const cancelledBooking = await bookingService.cancelBooking(bookingId, userId);
    res.status(200).json(cancelledBooking);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = {
  getAllBookings,
  getBooking,
  getBookingsByUser,
  getBookingsByListing,
  createBooking,
  cancelBooking,
};
