// models/fileModel.js
import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: {
      type: String,
      required: true, // from Cloudinary
    },
    fileType: {
      type: String,
      enum: ["pdf", "image", "other"],
      default: "pdf",
    },
    reportName: {
      type: String,
      required: true,
    },
    familyMemberName: { type: String, default: "Self" },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const File = mongoose.model("File", fileSchema);
