import { Schema, model, ObjectId } from 'mongoose';

const TokenSchema = new Schema(
  {
    token: {
      type: String,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const RefreshToken = model('refreshToken', TokenSchema);
