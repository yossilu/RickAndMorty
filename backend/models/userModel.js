const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    dob: {
      type: Date,
    },
    email: {
      type: String,
      unique: true,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String
    },
    address: {
      type: String
    },
    postal_code: {
      type: String
    },
    phone_number: {
      type: String
    },
    gender: {
      type: String
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    roles: {
      type: Array,
      'default': ["USER"]
    },
    refreshToken: {
      type: Array
    },
    profile_img: {
      key: {
        type: String,
      },
      location: {
        type: String,
      },
      name: {
        type: String,
      },
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)