'use strict';

const HttpErrors = require('../../errors/httpErrors');
const userService = require('../services/user');

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await userService.loginUser(email, password);
    res.status(200).json({ user, token });
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// Get a single user by ID
const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userService.getUser(id);
    if (!user) throw new HttpErrors('User not found', 404);
    res.status(200).json(user);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// Register a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { user, token } = await userService.createUser(name, email, password, role);
    res.status(201).json({ user, token });
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// Edit user profile
const editUser = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body; // Only allow certain fields in service
    const updatedUser = await userService.editUser(id, updates);
    res.status(200).json(updatedUser);
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
  loginUser,
  getUser,
  getAllUsers,
  createUser,
  editUser,
};
