const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { verifyJWT } = require('../middlewares/auth');

// Public routes
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);

// Protected routes (require authentication)
router.get('/', userController.getAllUsers);
router.get('/:id', verifyJWT, userController.getUser);
router.patch('/:id', verifyJWT, userController.editUser);

module.exports = router;
