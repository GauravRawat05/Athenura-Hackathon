/**
  university.model.js
  Defines the Mongoose schema and model for university records stored in MongoDB.
 */
import mongoose from "mongoose";

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "University Name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "University Code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "University Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: "India",
    },
    website: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Inactive"],
      default: "Active",
    },
    color: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const University = mongoose.model("University", universitySchema);
export default University;
