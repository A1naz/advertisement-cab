import { Schema, model } from "mongoose";

const CabinetSchema = new Schema({
  uuid: {
    type: String,
    default: "",
  },
  title: {
    type: String,
  },
  connectingMethod: {
    type: String,
    default: "phone number",
  },
  wbToken: {
    type: String,
    default: "",
  },
  status:{
    type: String,
    default: "Неактивен"
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  xSupplierId: {
    type: String,
    default: "",
  },
  apiKeyAdvertisement: {
    type: String,
    default: "",
  },
  apiKeyStatistic: {
    type: String,
    default: "",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Cabinet = model("Cabinet", CabinetSchema);
