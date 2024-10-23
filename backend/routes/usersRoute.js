const express = require('express')

const { loginUser, registerUser, getAllUsers, verifyUser, resendVerification, toggleIsActive, sendEmail } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth'); // Ensure you have this middleware for authorization


const router = express.Router()

//Login route
router.post('/login', loginUser)

//Register
router.post('/register', registerUser)

// Admin route to get all users
router.get('/admin', requireAuth, getAllUsers); // Protecting this route

router.patch('/admin/:id/isactive', requireAuth, toggleIsActive); // Protecting this route

router.post('/admin/send-email', requireAuth, sendEmail);

router.get('/verify/:token', verifyUser);

// Route for resending verification email
router.post('/resend-verification', resendVerification);

module.exports = router