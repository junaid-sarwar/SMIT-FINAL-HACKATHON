// models/userModel.js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phoneNumber:{
        type: Number,
        required:true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    familyMembers: [
  {
    name: String,
    relation: String,
    age: Number,
    gender: String,
  }
]
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
