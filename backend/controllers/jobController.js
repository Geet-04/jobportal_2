import { Job } from "../models/jobModel.js";

//For Admin
export const postJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
    const userId = req.id;

    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    const job = await Job.create({
      //It returns a Promise, which is why you use await.
      title, //if the variable name and the object key are the same, you can just write the variable name
      description,
      requirements: requirements.split(","), //converts a comma-separated string into an array of strings.
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience, //experienceLevel → database field name. experience → code variable holding the value.
      position,
      company: companyId,
      createdBy: userId,
    });
    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//For student
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || ""; //Get keyword from query params, if not provided, use empty string Example: /jobs?keyword=developer → keyword = "developer"
    // Create a MongoDB query object
    // $or means it will match if EITHER condition is true
    // $regex performs pattern matching (like "contains")
    // $options: "i" makes it case-insensitive
    const query = {
      $or: [
        {
          title: { $regex: keyword, $options: "i" },
        },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    // Fetch jobs from MongoDB based on query
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//For student
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
  }
};

//check admin create how many jobs till now
export const getAdminjobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ createdBy: adminId }).populate("company")
      .sort({createdAt:-1});
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
