import { Schema, model, } from "mongoose";

const CabinetSchema = new Schema({
  name: {
    type: String,
  },
  connectingMethod: {
    type: String,
    default: "phone number",
  },
  campaign: [
    {
      type: Schema.Types.ObjectId,
      ref: "Campgaign",
    },
  ],
});

export const User = model("Cabinet", CabinetSchema);
