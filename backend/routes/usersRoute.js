const express = require('express')

const { loginUser, registerUser, getAllUsers } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth'); // Ensure you have this middleware for authorization


const router = express.Router()

//Login route
router.post('/login', loginUser)

//Register
router.post('/register', registerUser)

// Admin route to get all users
router.get('/admin', requireAuth, getAllUsers); // Protecting this route

module.exports = router