import { Nitro } from 'nitropack';
import mongoose from 'mongoose';

export default async (_nitroApp: Nitro) => {
  const config = useRuntimeConfig();

  try {
    mongoose.connect(config.MONGO_URI);
  } catch (err) {
    console.log(err);
  }
};
