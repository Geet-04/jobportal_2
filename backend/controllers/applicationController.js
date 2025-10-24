import { Job } from '../models/jobModel.js';
import { Application } from './../models/applicationModel.js';

export const applyJob = async(req,res) => {
   try{
      const userId = req.id;
      const {id:jobId} = req.params;
      //or const jobId = req.params.id;
      if(!jobId){
         return res.status(400).json({
            message:"Job id is required.",
            success:false
         });
      };
      //check if the user has already applied for the job
      const existingApplication = await Application.findOne({job:jobId, applicant:userId});
      if(existingApplication){
         return res.status(400).json({
            message:"You have already applied for this job.",
            success:false
         });
      };

      //check if the jobs exists
      const job = await Job.findById(jobId);
      if(!job){
         return res.status(404).json({
            message:"Job not found",
            success:false
         })
      }
      //create a new application
      const newApplication = await Application.create({
         job:jobId,
         applicant:userId,
      });
      job.applications.push(newApplication._id);
      await job.save();
      return res.status(201).json({
         message:"Job applied successfully.",
         success:true
      })
   } catch(error){
      console.log(error);
   }
}

//It gives a logged-in user the full list of jobs they’ve applied for, including both job details and the hiring company details.
export const getAppliedJobs = async (req,res) => {
   try{
      const userId = req.id;  // Get the user ID from the request object (assuming middleware sets req.id after authentication)
      // Find all applications submitted by this user, sorted by newest first
      const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
         path:'job', //replace 'job' ObjectId with full Job document
         options:{sort:{createdAt:-1}}, // Sort applications by creation date descending
         populate:{
            path:'company', // inside Job, replace 'company' ObjectId with full Company document
            options:{sort:{createdAt:-1}}, // sort companies by creation date (optional)
         }
      });
      // If no applications are found, return 404 response
      if(!application){
         return res.status(404).json({
            message:"No Applications",
            success:false
         });
      };
      // If applications exist, return them with success flag
      return res.status(200).json({
         application, // Send the array of applications
         success:true
      })
   } catch(error){ // Log any errors that happen during DB query or population
      console.log(error);
   }
}

//Admin get Applicant those are applied tothe job
export const getApplicants = async (req,res) => {
   try{
      const jobId = req.params.id;
      const job = await Job.findById(jobId).populate({
         path:'applications',
         options:{sort:{createdAt:-1}},
         populate:{
            path:'applicant',

         }
      });
      if(!job){
         return res.status(404).json({
            message:'Job not found.',
            success:false
         });
      };
      return res.status(200).json({
         job,
         success:true,
      })
   } catch(error){
      console.log(error);
   }
}  

export const updateStatus = async (req,res)=>{
   try{
      const {status} = req.body;
      const applicationId = req.params.id;
      if(!status){
         return res.status(404).json({
            message:'status is required.',
            success:false
         });
      }
      //find the application by application id
      const application = await Application.findOne({_id:applicationId});
      if(!application){
         return res.status(404).json({
            message:'Application not found.',
            success:false
         });
      };
      //update the status
      application.status = status.toLowerCase();
      await application.save();

      return res.status(200).json({
         message:"Status updated successfully.",
         success:true
      })
   } catch(error){
      console.log(error);
   }
}