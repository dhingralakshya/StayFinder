'use strict';

const HttpErrors = require('../../errors/httpErrors');
const listingService = require('../services/listing');

// Get a single listing by ID
const getListing = async (req, res) => {
  try {
    const id = req.params.id;
    const listing = await listingService.getListing(id);
    if (!listing) throw new HttpErrors('Listing not found', 404);
    res.status(200).json(listing);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

const getListingsByHost = async (req, res) => {
  try {
    const hostId = req.user.id;
    const listings = await listingService.getListingsByHost(hostId);
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Get all listings
const getAllListings = async (req, res) => {
  try {
    const listings = await listingService.getAllListings();
    res.status(200).json(listings);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// Create a new listing (host only)
const createListing = async (req, res) => {
  try {
    const { title, description, price, location, imageUrls } = req.body;
    const hostId = req.user.id;
    const newListing = await listingService.createListing(title, description, price, location, hostId, imageUrls);
    res.status(201).json(newListing);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// Edit a listing (host only, must own the listing)
const editListing = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const hostId = req.user.id;
    const updatedListing = await listingService.editListing(id, updates, hostId);
    res.status(200).json(updatedListing);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// Delete a listing (host only, must own the listing)
const deleteListing = async (req, res) => {
  try {
    const id = req.params.id;
    const hostId = req.user.id;
    const result = await listingService.deleteListing(id, hostId);
    res.status(200).json(result);
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
  getListing,
  getListingsByHost,
  getAllListings,
  createListing,
  editListing,
  deleteListing,
};
