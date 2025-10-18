// models/vitalsModel.js
import mongoose from 'mongoose'

const vitalsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bp: {
      type: String, // e.g. "120/80"
      default: "",
    },
    sugar: {
      type: Number, // e.g. 95
      default: null,
    },
    weight: {
      type: Number, // e.g. 68
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Vitals = mongoose.model("Vitals", vitalsSchema);
