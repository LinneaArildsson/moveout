const UserModel = require('../models/User')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.JWT_SECRET_KEY, {expiresIn: '3d'})
}

//login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try{
    const user = await UserModel.loginUsers(email, password)

    const token = createToken(user._id)

    res.status(200).json({
      email: user.email,
      name: user.name,
      token,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

//Register a user
const registerUser = async (req, res) => {
  const {email, name, password} = req.body

  try {
    const user = await UserModel.registerUsers(email, name, password)

    // Set isAdmin to false by default
    user.isAdmin = false;
    await user.save();

    const token = createToken(user._id)

    res.status(200).json({
      email: user.email,
      name: user.name,
      token,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// Get all users for admin
const getAllUsers = async (req, res) => {
  try {
      // Check if the user is an admin
      if (!req.user.isAdmin) {
          return res.status(403).json({ error: 'Access denied' });
      }

      const users = await UserModel.find(); // Retrieve all users
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

  
module.exports = { registerUser, loginUser, getAllUsers }