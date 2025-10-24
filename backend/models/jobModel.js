import mongoose from "mongoose";

const jobSchema = new mongoose.Schema ({
   title:{
      type:String,
      required:true,
   },
   description:{
      type:String,
      required:true,
   },
   requirements:{
      type:[String],
   },
   salary:{
      type:Number,
      required:true,
   },
   experienceLevel:{
      type:Number,
      required:true,
   },
   location:{
      type:String,
      required:true,
   },
   jobType:{
      type:String,
      required:true,
   },
   position:{
      type:Number,
      required:true,
   },
   company:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Company',
      required:true,
   },
   createdBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true,
   },
   applications:[ //field in Job, holds an array.
      {
         type:mongoose.Schema.Types.ObjectId, //Each item in the applications array will store an ObjectId(Application’s ID).
         ref:'Application', //links those IDs to the Application model, so you can use .populate() to fetch full docs.
      }
   ]
},{timestamps:true});

export const Job = mongoose.model("Job", jobSchema);