const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// POST /users
router.post('/', userController.createUser);

// GET /users/:userId
router.get('/:userId', userController.getUserDetails);

module.exports = router;
