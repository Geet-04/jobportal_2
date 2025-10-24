import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie-parser";
import getDataUri from "./../utils/datauri.js";
import cloudinary from "./../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    //validate
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    // check existing user
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exist with this email.",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while registering user",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({
      message: "Something is missing",
      success: false,
    });
  }
  let user = await User.findOne({ email }); //If a matching document is found → an object representing that user, containing all the fields defined in your Mongoose schema (like _id, fullname, email, password, role, etc.). If no matching document is found → it will store null.
  if (!user) {
    return res.status(400).json({
      message: "Incorrect email or password.",
      success: false,
    });
  }
  //bcrypt.compare() takes the plain password and the stored hash, hashes the plain one internally, and returns true if they match, else false.
  const isPasswordMatched = await bcrypt.compare(password, user.password); //password comes from the request body (the raw password entered by the user when logging in). and user.password comes from the database, where the user’s password was stored in a hashed form during registration.
  if (!isPasswordMatched) {
    return res.status(400).json({
      message: "Incorrect email or password.",
      success: false,
    });
  }
  //check role is correct or not
  if (role !== user.role) {
    return res.status(400).json({
      message: "Account does not exist with current role.",
      success: false,
    });
  }
  //creating the payload for your JWT. payload = data you want to store in the token (e.g., user ID)
  const tokenData = { userId: user._id }; //tokenData is an object containing the information you want to include in the token
  // token options (optional)
  const options = { expiresIn: "1d" }; // token expires in 1 day
  //create token
  const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  user = {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    profile: user.profile,
  };

  //You are logging the user in, storing their JWT in a secure cookie, and sending a success message back to the client.
  return res
    .status(200) //Sets HTTP status code 200 (OK)
    .cookie("token", token, {
      //Sets a cookie named "token" with value `token`
      maxAge: 1 * 24 * 60 * 60 * 1000, //Cookie expires in 1 day (milliseconds)
      httpOnly: true, //Cookie is not accessible via JavaScript (secure from XSS)
      sameSite: "strict", //Cookie is only sent to your site, preventing CSRF
    })
    .json({
      //Sends a JSON response to the client
      message: `Welcome back ${user.fullname}`,
      success: true,
      token,
      user,
    });
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    //cloudinary  write here

    // Convert file to Data URI(base64 string) by calling function
    // fileUri.content now contains the base64 string ready for upload
    const fileUri = getDataUri(file);

    // Upload to Cloudinary and get uploaded file info
    // 'await' ensures we wait for the upload to finish
    // cloudResponse contains details about the uploaded file, like its URL, public_id, format, etc.
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content,{
      resource_type: "auto",      // handles any file type (PDF, image, etc.)
      folder: "jobPortal/resumes", // optional: upload inside a specific Cloudinary folder
      use_filename: true,          // keeps the original name
      unique_filename: false      // prevents Cloudinary from renaming the file
    });

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(","); // Converting comma-separated skills string into an array Example: "JavaScript,React,Node.js" → ["JavaScript", "React", "Node.js"]
    }
    //middleware authentication-Get the logged-in user
    const userId = req.id; // req.id was set in authentication middleware after verifying JWT.It represents the logged-in user’s ID
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User Not Found.",
        success: false,
      });
    }
    // Updating user data/fields with new values
    //Here you are updating the MongoDB User document with the new data.
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    // Update resume if uploaded
    if (file && cloudResponse) {
      user.profile.resume = cloudResponse.secure_url; //save the cloudinary url
      //originalname is a built-in Multer property that stores the uploaded file’s original name from the user’s computer.
      user.profile.resumeOriginalName = file.originalname; //save the original file name
    }

    await user.save();

    //prepare a safe response object to send back.
    //You’re overwriting user with a plain object to avoid sending sensitive fields (like password/tokens) and only return safe data in the response.
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      User: user, // <-- frontend expects 'User'
    });
  } catch (error) {
    console.log(error);
  }
};
