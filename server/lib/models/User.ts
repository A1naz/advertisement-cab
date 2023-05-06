import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: [{ type: String }],
    default: 'USER',
  },
  uuid: { type: String },
  balance: {
    type: Number,
    default: 0,
  },
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  username: {
    type: String,
    default: '',
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
})

export const User = model('User', UserSchema)
