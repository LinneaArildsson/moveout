const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator')

const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    verificationToken: {
      type: String
    },
    verificationTokenExpires: {
      type: Date
    }
  }, { timestamps: true });

//Static register method
UserSchema.statics.registerUsers = async function(email, name, password) {
  if (!email || !password) {
    throw Error('Both email and password are required to register')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email is not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password is not strong enough')
  }

  const exists = await this.findOne({email})

  if (exists) {
    throw Error('Email already registred')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({email, name, password: hash, isAdmin: false})

  return user
}

//Static login method
UserSchema.statics.loginUsers = async function(email, password) {
  if (!email || !password) {
    throw Error('All fields must be provided')
  }
  if(!validator.isEmail(email)) {
    throw Error('Email is not valid');
  }

  const user = await this.findOne({email})
  if (!user) {
    throw Error('No user registred with this email')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
