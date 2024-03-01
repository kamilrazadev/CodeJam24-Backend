import { Schema, model } from "mongoose";

const OtpSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  reqTime: {
    type: Number,
    default: 0,
  },
  sentTime: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export default model("otp", OtpSchema);
