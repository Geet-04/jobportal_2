import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
   job:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Job",
      required:true,
   },
   applicant:{
      type:mongoose.Schema.Types.ObjectId,
      ref: "User", // <-- tells Mongoose which collection to populate
      required:true,
   },
   status:{
      type:String,
      enum:['pending', 'accepted', 'rejected'],
      default:'pending'
   }
},{timestamps:true});

export  const Application = mongoose.model("Application", applicationSchema)