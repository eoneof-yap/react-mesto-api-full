const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UnauthorizedError = require('../errors/UnauthorizedError');

const {
  DEFAULT_NAME,
  DEFAULT_ABOUT,
  DEFAULT_AVATAR,
  WRONG_CREDENTIALS_TEXT,
} = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: DEFAULT_NAME,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: DEFAULT_ABOUT,
  },
  avatar: {
    type: String,
    required: true,
    default: DEFAULT_AVATAR,
    validate: {
      validator(avatar) {
        return validator.isURL(avatar);
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
});

// eslint-disable-next-line func-names
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(WRONG_CREDENTIALS_TEXT));
      }

      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(WRONG_CREDENTIALS_TEXT));
          }
          return user.toJSON();
        })
        .then(() => user);
    });
};

module.exports = mongoose.model('user', userSchema);
