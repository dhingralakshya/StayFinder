'use strict';

const ListingModel = require('../models').Listing;
const UserModel = require('../models').User;
const HttpErrors = require('../../errors/httpErrors');

// Fetch a single listing by ID
const getListing = async (id) => {
  const listing = await ListingModel.findByPk(id, {
    include: [
      {
        model: UserModel,
        as: 'host',
        attributes: ['id', 'name', 'email', 'role']
      }
    ]
  });
  if (!listing) throw new HttpErrors('Listing not found', 404);
  return listing;
};

const getListingsByHost = async (hostId) => {
  const listings = await ListingModel.findAll({
    where: { hostId },
    order: [['createdAt', 'DESC']]
  });
  return listings;
};

// Fetch all listings
const getAllListings = async () => {
  const listings = await ListingModel.findAll({
    include: [
      {
        model: UserModel,
        as: 'host',
        attributes: ['id', 'name', 'email', 'role']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
  return listings;
};

// Create a new listing (host only)
const createListing = async (title, description, price, location, hostId, imageUrls) => {
  const host = await UserModel.findByPk(hostId);
  if (!host || host.role !== 'host') {
    throw new HttpErrors('Only hosts can create listings.', 403);
  }

  const newListing = await ListingModel.create({
    title,
    description,
    price,
    location,
    hostId,
    imageUrls
  });

  return newListing;
};

// Edit a listing (host only, must own the listing)
const editListing = async (id, updates, hostId) => {
  const allowedFields = ['title', 'description', 'price', 'location', 'imageUrls'];
  const updateData = {};
  allowedFields.forEach(field => {
    if (updates[field] !== undefined) updateData[field] = updates[field];
  });

  // Find the listing and check ownership
  const listing = await ListingModel.findByPk(id);
  if (!listing) throw new HttpErrors('Listing not found', 404);
  if (listing.hostId !== hostId) throw new HttpErrors('Unauthorized', 403);

  await listing.update(updateData);
  return listing;
};

// Delete a listing (host only, must own the listing)
const deleteListing = async (id, hostId) => {
  const listing = await ListingModel.findByPk(id);
  if (!listing) throw new HttpErrors('Listing not found', 404);
  if (listing.hostId !== hostId) throw new HttpErrors('Unauthorized', 403);

  await listing.destroy();
  return { message: 'Listing deleted successfully.' };
};

module.exports = {
  getListing,
  getListingsByHost,
  getAllListings,
  createListing,
  editListing,
  deleteListing,
};
