import { Schema, model } from "mongoose";

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
    default: "USER",
  },
  uuid: { type: String },
  balance: {
    type: Number,
    default: 0,
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    default: "",
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
  xSupplierId: {
    type: String,
    default: "",
  },
  apiKeyAdvertisement: {
    type: String,
    default: "",
  },
  apiKeyStatistics: {
    type: String,
    default: "",
  },
  wbToken: {
    type: String,
    default: "",
  },
  proxy: {
    type: String,
    default: "",
  },
  wbUserId: {
    type: String,
    default: "",
  },
  checkStatsBot: {
    type: Boolean,
    default: false,
  },
  tariffs: {
    type: [Object],
    default: [
      {
        type: "default",
        active: false,
        date: "",
      },
      {
        type: "advanced",
        active: false,
        date: "",
      },
    ],
  },
});

export const User = model("User", UserSchema);
