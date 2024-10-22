const express = require('express')

const { loginUser, registerUser, getAllUsers, verifyUser, resendVerification } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth'); // Ensure you have this middleware for authorization


const router = express.Router()

//Login route
router.post('/login', loginUser)

//Register
router.post('/register', registerUser)

// Admin route to get all users
router.get('/admin', requireAuth, getAllUsers); // Protecting this route

router.get('/verify/:token', verifyUser);

// Route for resending verification email
router.post('/resend-verification', resendVerification);

module.exports = router