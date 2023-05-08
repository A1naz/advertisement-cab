import { Schema, model } from "mongoose";

const CampaignSchema = new Schema(
  {
    uuid: {
      type: String,
    },
    advertid: {
      type: String,
      default: "",
    },
    type: {
      type: Number,
      default: 5,
    },
    name: {
      type: String,
      default: "",
    },
    Category: {
      type: String,
      default: "",
    },
    params: {
      type: [{ type: Object}],
      default: "",
    },
    status: {
      type: Number,
      default: 11,
    },
    campaignManagement: {
      type: Boolean,
      default: false,
    },
    expences: {
      type: Number,
      default: 0,
    },
    CPC: {
      type: Number,
      default: 0,
    },
    shows: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    CTR: {
      type: Number,
      default: 0,
    },
    cart: {
      type: Number,
      default: 0,
    },
    orders: {
      type: Number,
      default: 0,
    },
    CR: {
      type: Number,
    },
    isAdjusted: {
      type: Boolean,
      default: false,
    },
    budget: {
      type: Number,
      default: 0,
    },
    targetPosition: {
      type: String,
      default: "",
    },
    maxBet: {
      type: Number,
      default: 0,
    },
    dailyBudget: {
      type: Number,
      default: 0,
    },
    showHours: {
      type: String,
      default: "00:00 - 00:00 | 00:00 - 00:00",
    },
    ifMaxBetDoesntMatch: {
      type: String,
      default: "Остановить кампанию",
    },
    MaxBetIncreaseTo: {
      type: Number,
      default: 0,
    },
    ifBetEqualsNear: {
      type: String,
      default: "Увеличить ставку на 1 руб.",
    },
    deliveryTime: {
      type: String,
      default: "",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createTime: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Campaign = model("Campaign", CampaignSchema);
