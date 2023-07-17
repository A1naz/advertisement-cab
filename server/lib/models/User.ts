import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: false,
  },
  password: {
    type: String,
    required: false,
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
  telegram: { type: String, required: false },
  telegramUserId: { type: String, required: false },
  telegramUnlinkEmailSend: { type: Date, required: false },
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
  isApiPlusTokenEnabled: {
    type: Boolean,
    default: false,
  },
});

export const User = model("User", UserSchema);
