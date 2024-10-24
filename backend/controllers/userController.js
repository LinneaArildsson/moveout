const UserModel = require('../models/User')
const jwt = require('jsonwebtoken')

const LabelModel = require('../models/Label')

const crypto = require('crypto');
const nodemailer = require('nodemailer');

require("dotenv").config()

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.JWT_SECRET_KEY, {expiresIn: '3d'})
}

//login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try{
    const user = await UserModel.loginUsers(email, password)

    const token = createToken(user._id);

    res.status(200).json({
      email: user.email,
      name: user.name,
      token,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      isActive: user.isActive
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

    // Automatically verify Gmail users
    if (email.endsWith('@gmail.com') || email.endsWith('@googlemail.com')) {
      user.isVerified = true; // Automatically set as verified
    } else {
      const { token, expires } = generateVerificationToken();
      user.verificationToken = token;
      user.verificationTokenExpires = expires;
      await user.save();
      await sendVerificationEmail(user, token); // Send verification email
    }

    await user.save();

    // Send verification email
    //await sendVerificationEmail(user, token);

    const jwttoken = createToken(user._id)

    res.status(200).json({
      email: user.email,
      name: user.name,
      token: jwttoken,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      isActive: true
    });
  } catch (error) {
    console.log("REGISTER ERROR: ", error.message)
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
      const labels = await LabelModel.find({ user_id: user._id }); // Assuming 'userId' is the reference field
      
      const totalFileSize = labels.reduce((total, labels) => {
        return total + labels.totalFileSize; // Accumulate the total file size
      }, 0);
      return { ...user.toObject(), labels, totalFileSize}; // Convert Mongoose object to plain JS object
    }));

    res.status(200).json(usersWithLabels);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
}

const toggleIsActive = async (req, res) => {
  const {id} = req.params;

  console.log("ID: ", id);

  if (!req.user.isAdmin) {
    return res.status(403).json({error: 'Access denied'});
  }

  try {
    // Fetch user
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Toggle active status
    if(user.isActive){
      user.isActive = false;
    }
    else {
      user.isActive = true;
    }

    await user.save();

    res.status(200).json({ message: 'User active status updated', isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
}

const sendEmail = async (req, res) => {
  const { recipientEmail, subject, body } = req.body;

  if (!req.user.isAdmin) {
    return res.status(403).json({error: 'Access denied'});
  }

  // Create a transporter object
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: subject,
    text: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email.' });
  }
}

const generateVerificationToken = () => {
  const token = crypto.randomBytes(20).toString('hex');
  const expires = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours
  return { token, expires };
};

const sendVerificationEmail = async (user, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationUrl = `https://moveout.onrender.com/user/verify/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Verify your account',
    text: `Please verify your account by clicking the following link: ${verificationUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to ' + user.email);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.params;

  console.log("Verify Token: ", token);

  try {
    const user = await UserModel.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    if (user.verificationTokenExpires < Date.now()) {
      return res.status(400).json({ error: 'Verification token expired' });
    }

    user.isVerified = true;
    user.verificationToken = undefined; // Remove token after verification
    user.verificationTokenExpires = undefined; 
    await user.save();

    return res.status(200).send('<h1>Account verified successfully!</h1>');
  } catch (error) {
    return res.status(500).json({ error: 'Error verifying account' });
  }
};

const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user || user.isVerified) {
      return res.status(400).json({ error: 'User already verified or does not exist' });
    }

    // Automatically verify Gmail users
    if (email.endsWith('@gmail.com') || email.endsWith('@googlemail.com')) {
      user.isVerified = true; // Automatically set as verified
      await user.save();
      return res.status(200).json({ message: 'Gmail user automatically verified' });
    } else {
      // Generate new token and send verification email for non-Gmail users
      const token = generateVerificationToken();
      user.verificationToken = token;
      await user.save();

      await sendVerificationEmail(user, token);
      return res.status(200).json({ message: 'Verification email sent' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error resending verification email' });
  }
};

  
module.exports = { registerUser, loginUser, getAllUsers, verifyUser, resendVerification, toggleIsActive, sendEmail }