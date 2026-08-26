import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return v.trim().split(/\s+/).length >= 2;
        },
        message: "Please enter at least two names (e.g. John Doe)",
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 15,
    },
    role: {
      type: String,
      default: "student",
      enum: ["student", "admin"],
    },
    academicLevel: {
      type: String,
      default: " ",
    },
    major: {
      type: String,
      default: " ",
    },
    targetRole: {
      type: String,
      default: " ",
    },
    skills: [String],
    preferredGenres: [String],
    learningStyle: {
      type: String,
      default: " ",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema)