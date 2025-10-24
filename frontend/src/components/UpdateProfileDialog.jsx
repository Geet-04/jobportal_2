import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "../utils/constant";
import axios from "axios";
import { DialogDescription } from "@radix-ui/react-dialog";
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const UpdateProfileDialog = ({ open, setOpen }) => {
   const [loading, setLoading] = useState(false);  //used to show a spinner when the form is submitting.
   const {User} = useSelector(store => store.auth); //fetched from Redux store. Contains the current logged-in user's details.

   //get data whaich are already given in store
   //Form Input State - Stores all form data in a single object:
   const [input, setInput] =  useState({   //input is an object holding the form values.fullname and email are keys in this object. user?.fullname and user?.email are used to pre-fill the form with existing user data.
      fullname:User?.fullname || "",  //If user exists, input.fullname will have the current name. If user is not yet loaded, it will be undefined. NOTE: ?. ensures the app doesn’t crash if user is not available yet.
      email:User?.email || "", 
      phoneNumber:User?.phoneNumber || "",
      bio:User?.profile?.bio || "",
      skills:User?.profile?.skills?.map(skill=>skill) || "", //copies the skills array from the user profile.  
      //Redux user → contains profile.skills array.
      // Optional chaining ensures safe access: user?.profile?.skills.
      // .map(skill => skill) creates a new array so you can safely edit it in the form.
      //This array is stored in input.skills → used as the value for the Skills input.
      file:User?.profile?.resume || ""
   });

   const dispatch = useDispatch();

   //get user data put on form 
   //Dynamically updates the corresponding field in input based on the input’s name.
   const changeEventHandler = (e) => {
      setInput({...input,[e.target.name]:e.target.value});
   }
   
   //Handles file upload for resume. Stores the first file in input.file.
   const fileChangeHandler = (e) => {
      const file = e.target.files?.[0];
      setInput({...input, file})
   }

   //form submission 
   const submitHandler = async (e) => {
      e.preventDefault();
      const formData = new FormData(); //Creates FormData to send files and other fields.
      //store updated data given in form
      formData.append("fullname", input.fullname);
      formData.append("email", input.email);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("bio", input.bio);
      formData.append("skills", input.skills);
      if(input.file){
         formData.append("file", input.file);
      }

      try{
        setLoading(true);
         const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData,{
            headers:{
              'Content-Type':'multipart/form-data' 
            },
            withCredentials:true 
         });
         if(res.data.success){
            dispatch(setUser(res.data.User)); //dispatch updated user to backend
            toast.success(res.data.message);
         }
      } catch(error){
        console.log(error);
        toast.error(error.response.data.message);
      } finally{
        setLoading(false);
      }
      setOpen(false);
   }

   return (
    <div>
      <Dialog open={open} >  {/*onOpenChange is built into the shadcn/ui Dialog component.*/}
        <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-xl" onInteractOutside={()=> setOpen(false)}>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
              Update your personal details and upload your resume here.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitHandler}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullname" className="text-right">Full Name</Label>
                <Input 
                  id="fullname" 
                  name="fullname" 
                  type="text"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right">Phone No</Label>
                <Input 
                  id="phoneNumber" 
                  name="phoneNumber" 
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">Bio</Label>
                <Input
                  id="bio" 
                  name="bio"
                  value={input.bio}
                  onChange={changeEventHandler} 
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Skills" className="text-right">Skills</Label>
                <Input 
                  id="skills" 
                  name="skills" 
                  value={input.skills}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">Resume</Label>
                <Input 
                  id="file" 
                  type="file"
                  name="file" 
                  accept="application/pdf"
                  onChange={fileChangeHandler}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
               {
                  loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please wait </Button> : <Button type="submit" className="w-full my-4 bg-black text-white hover:bg-gray-900"> Update </Button>
               }
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateProfileDialog; 