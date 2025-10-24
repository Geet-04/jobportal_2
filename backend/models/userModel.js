import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Name Is Required"],
    },
    email: {
      type: String,
      required: [true, "Email Is Required"],
      unique: true,
      validate: validator.isEmail,
    },
    phoneNumber: {
      type: Number,
      required: [true, "Email Is Required"],
    },
    password: {
      type: String,
      required: [true, "Password Is Required"],
      minlength: [6, "Password length should be greater than 6 character"],
    },
    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: { type: String }, //URL to resume file
      resumeOriginalName: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
