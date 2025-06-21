'use strict';

const BookingModel = require('../models').Booking;
const UserModel = require('../models').User;
const ListingModel = require('../models').Listing;
const HttpErrors = require('../../errors/httpErrors');

const getAllBookings = async () => {
  const bookings = await BookingModel.findAll({
    include: [
      {
        model: UserModel,
        as: 'user',
        attributes: ['id', 'name', 'email']
      },
      {
        model: ListingModel,
        as: 'listing',
        attributes: ['id', 'title', 'location', 'price']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
  return bookings;
};

// Fetch a single booking by ID
const getBooking = async (id) => {
  const booking = await BookingModel.findByPk(id, {
    include: [
      {
        model: UserModel,
        as: 'user',
        attributes: ['id', 'name', 'email']
      },
      {
        model: ListingModel,
        as: 'listing',
        attributes: ['id', 'title', 'location', 'price']
      }
    ]
  });
  if (!booking) throw new HttpErrors('Booking not found', 404);
  return booking;
};

// Fetch all bookings by a user
const getBookingsByUser = async (userId) => {
  const bookings = await BookingModel.findAll({
    where: { userId },
    include: [
      {
        model: ListingModel,
        as: 'listing',
        attributes: ['id', 'title', 'location', 'price']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
  return bookings;
};

// Fetch all bookings for a listing (host can use this)
const getBookingsByListing = async (listingId) => {
  const bookings = await BookingModel.findAll({
    where: { listingId },
    include: [
      {
        model: UserModel,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
  return bookings;
};

// Create a new booking
const createBooking = async (userId, listingId, startDate, endDate, totalPrice) => {
  // Validate user exists
  const user = await UserModel.findByPk(userId);
  if (!user) {
    throw new HttpErrors('User not found', 404);
  }

  // Validate listing exists
  const listing = await ListingModel.findByPk(listingId);
  if (!listing) {
    throw new HttpErrors('Listing not found', 404);
  }

  // Optional: Add availability check here (e.g., no overlapping bookings)

  const newBooking = await BookingModel.create({
    userId,
    listingId,
    startDate,
    endDate,
    totalPrice,
    status: 'pending' // default status
  });

  return newBooking;
};

// Cancel a booking (user can cancel their own booking)
const cancelBooking = async (bookingId, userId) => {
  const booking = await BookingModel.findByPk(bookingId);
  if (!booking) {
    throw new HttpErrors('Booking not found', 404);
  }
  if (booking.userId !== userId) {
    throw new HttpErrors('Unauthorized', 403);
  }

  // You can implement soft delete or update status here
  await booking.update({ status: 'cancelled' });

  return booking;
};

module.exports = {
  getAllBookings,
  getBooking,
  getBookingsByUser,
  getBookingsByListing,
  createBooking,
  cancelBooking,
};
