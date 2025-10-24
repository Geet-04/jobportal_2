import express from "express"
import { getCompantById, getCompany, registerCompany, updateCompany } from "../controllers/companyController.js";
import isAuthenticated from './../middlewares/isAuthenticated.js';
import { singleUpload } from './../middlewares/multer.js';

//router object
const router = express.Router();

//create route
router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompantById);
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);

export default router;