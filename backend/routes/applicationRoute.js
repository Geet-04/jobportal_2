import express from "express"
import isAuthenticated from './../middlewares/isAuthenticated.js';
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/applicationController.js";

//router object
const router = express.Router();

//create route
router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);

export default router;