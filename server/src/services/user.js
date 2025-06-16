'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models').User;
const HttpErrors = require('../../errors/httpErrors');
require('dotenv').config();

// Fetch a single user by ID
const getUser = async (id) => {
  const user = await UserModel.findByPk(id, {
    attributes: { exclude: ['password'] }
  });
  if (!user) throw new HttpErrors('User not found', 404);
  return user;
};

// Fetch all users
const getAllUsers = async () => {
  const users = await UserModel.findAll({
    attributes: { exclude: ['password'] }
  });
  return users;
};

// Register a new user
const createUser = async (name, email, password, role = 'guest') => {
  const existing = await UserModel.findOne({ where: { email } });
  if (existing) throw new HttpErrors('User already registered with this email', 400);

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // Prepare JWT payload
  const payload = {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  };

  const token = jwt.sign(payload, process.env.jwtPrivateKey, { expiresIn: '6h' });

  // Exclude password from returned user object
  const userObj = newUser.toJSON();
  delete userObj.password;

  return { user: userObj, token };
};

// Login user
const loginUser = async (email, password) => {
  const user = await UserModel.findOne({ where: { email } });
  if (!user) throw new HttpErrors('Invalid email or password', 400);

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new HttpErrors('Invalid email or password', 400);

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.jwtPrivateKey, { expiresIn: '6h' });

  // Exclude password from returned user object
  const userObj = user.toJSON();
  delete userObj.password;

  return { user: userObj, token };
};

// Edit user profile
const editUser = async (id, updates) => {
  // Only allow certain fields to be updated
  const allowedFields = ['name', 'email', 'role'];
  const updateData = {};
  allowedFields.forEach(field => {
    if (updates[field] !== undefined) updateData[field] = updates[field];
  });

  const [affectedRows] = await UserModel.update(updateData, { where: { id } });
  if (!affectedRows) throw new HttpErrors('User not found or nothing to update', 404);

  const updatedUser = await UserModel.findByPk(id, {
    attributes: { exclude: ['password'] }
  });
  return updatedUser;
};

module.exports = {
  getUser,
  getAllUsers,
  createUser,
  loginUser,
  editUser,
};
