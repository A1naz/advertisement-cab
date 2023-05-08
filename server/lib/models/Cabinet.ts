import { Schema, model } from "mongoose";

const CabinetSchema = new Schema({
  advertId: {
    type: String,
    default: "",
  },
  name: {
    type: String,
  },
  type: {
    type: Number,
  },
  status: {
    type: Number,
  },
  dailyBudget: {
    type: Number,
  },
  nms: {
    type: [{ type: String }],
    default: "",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Cabinet = model("Cabinet", CabinetSchema);
