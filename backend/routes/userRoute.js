import express from "express";
import { login, logout, register, updateProfile } from "../controllers/userController.js"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from './../middlewares/multer.js';

//router object
const router = express.Router();

//create route
router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/profile/update").post(isAuthenticated, singleUpload,updateProfile); //singleUpload middleware , Handles single file upload from field 'file' and stores it in memory (req.file)
router.route("/logout").get(logout);
export default router;