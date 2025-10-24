import express from "express"
import isAuthenticated from './../middlewares/isAuthenticated.js';
import { getAdminjobs, getAllJobs, getJobById, postJob } from "../controllers/jobController.js";

//router object
const router = express.Router();

//create route
router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminjobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
export default router;