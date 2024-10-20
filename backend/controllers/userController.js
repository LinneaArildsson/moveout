const UserModel = require('../models/User')
const jwt = require('jsonwebtoken')

const LabelModel = require('../models/Label')

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
  console.log(`User isAdmin: ${req.user.isAdmin}`);

  if (!req.user.isAdmin) {
    return res.status(403).json({error: 'Access denied'});
  }

  try {
    // Fetch all users
    const users = await UserModel.find({});

    // Fetch labels for each user and attach them
    const usersWithLabels = await Promise.all(users.map(async (user) => {
      const labels = await LabelModel.find({ userId: user._id }); // Assuming 'userId' is the reference field
      return { ...user.toObject(), labels }; // Convert Mongoose object to plain JS object
    }));

    res.status(200).json(usersWithLabels);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
}

  
module.exports = { registerUser, loginUser, getAllUsers }