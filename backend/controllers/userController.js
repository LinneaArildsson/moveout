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
      email: user.email, // Assuming email is part of the user object
      name: user.name, // Include the user's name here
      token,
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

    const token = createToken(user._id)

    res.status(200).json({
      email: user.email,
      name: user.name, // Include the user's name here
      token,
    });
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}
  
module.exports = { registerUser, loginUser }