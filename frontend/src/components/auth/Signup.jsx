import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button} from '../ui/button'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { toast } from "sonner";
import axios from 'axios'
import { USER_API_END_POINT } from './../../utils/constant';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from '../../redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {
   const [input, setInput] = useState({
    fullname:"",
    email:"",
    phoneNumber:"",
    password:"",
    role:"",
    file:""
  });
  const {loading, User} = useSelector(store=>store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({
      ...input, 
      [e.target.name]:e.target.value,
    });
  };

  //It stores the actual File object (not just filename) so you can later upload it to a server (e.g., with FormData).
  const changeFileHandler = (e)=> {   //When you select a file, the browser gives you an array-like object e.target.files. Example: if you select a file called resume.pdf, then: e.target.files = [ File { name: "resume.pdf", size: 102400, type: "application/pdf" } ]
    setInput({
      ...input,
      file:e.target.files?.[0]  //e.target.files[0] → takes the first selected file and ?. (optional chaining) means: If files exists, use [0], If files is undefined (e.g., user cancels file selection), it won’t throw an error, it just sets file to undefined.
    });
  };

   const submitHandler = async (e) => {
   e.preventDefault();
   // Validation before sending
   const { fullname, email, phoneNumber, password, role } = input;
   if (!fullname || !email || !phoneNumber || !password || !role) {
   toast.error("Please fill all required fields!");
   return;
   }
   //Create a FormData object — used to send form fields & files (like images). //FormData → prepares text + file data to send.
   const formData = new FormData();
   //Add each field from the state "input" into the FormData.
   formData.append("fullname",input.fullname); // User’s full name
   formData.append("email",input.email); // User’s email
   formData.append("phoneNumber",input.phoneNumber);
   formData.append("password",input.password);
   formData.append("role",input.role);
   //If the user selected a file (like profile picture), append it too.
   if(input.file){
      formData.append("file",input.file);
   }
   
   try{
      dispatch(setLoading(true));
      const res= await axios.post(`${USER_API_END_POINT}/register`, formData,{
         headers:{
            "Content-Type":"multipart/form-data"
         },
         withCredentials:true,
      });
      //If API responds with success = true, do these:
      if(res.data.success){
         // Navigate user to homepage ("/") after successful signup
         navigate("/login");
         // Show success notification with message from backend (using toast)
         toast.success(res.data.message);
      }
   } catch(error){
      console.log(error); //If any error occurs (network / validation / server), log it for debugging
      toast.error(error.response.data?.message || "Server error");
   } finally {
      dispatch(setLoading(false));
   }
  }

   useEffect(()=> {
     if(User){
        navigate("/");
     }
   },[]);

   return (
    <div>
      <Navbar/>
      <div className='flex items-center justify-center max-w-7xl mx-auto'>
         <form onSubmit={submitHandler} className='w-1/2  border border-gray-200 rounded-md p-4 my-10'>
            <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
            <div className='my-2'>
               <Label>Full Name</Label>
               <Input
                  type="text"
                  value={input.fullname}
                  name="fullname"
                  onChange={changeEventHandler}
                  placeholder=" Enter Your Full Name"
               />
            </div>
            <div className='my-2'>
               <Label>Email</Label>
               <Input
                  type="email"
                  value={input.email}
                  name="email"
                  onChange={changeEventHandler}
                  placeholder="Enter Your Email"
               />
            </div>
            <div className='my-2'>
               <Label>Phone Number</Label>
               <Input
                  type="text"
                  value={input.phoneNumber}
                  name="phoneNumber"
                  onChange={changeEventHandler}
                  placeholder="Enter Your Phone Number"
               />
            </div>
            <div className='my-2'>
               <Label>Password</Label>
               <Input
                  type="Password"
                  value={input.password}
                  name="password"
                  onChange={changeEventHandler}
                  placeholder="Enter Your Password"
               />
            </div>
            <div className='flex items-center justify-between'>
               <RadioGroup className='flex items-center gap-4 my-5'>
                  <div className="flex items-center space-x-2">
                  <Input
                     type="radio"
                     name="role"
                     value="student"
                     checked={input.role === 'student'}
                     onChange={changeEventHandler}
                     className="cursor-pointer"
                     />
                     <Label htmlFor="r1">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                  <Input
                     type="radio"
                     name="role"
                     value="recruiter"
                     checked={input.role === 'recruiter'}
                     onChange={changeEventHandler}
                     className="cursor-pointer"
                     />
                     <Label htmlFor="r2">Recruiter</Label>
                  </div>
               </RadioGroup>
               <div className="flex items-center space-x-2">
                  <Label>Profile</Label>
                  <Input 
                     accept="image/*"
                     type="file"
                     onChange={changeFileHandler}
                     className="cursor-pointer"
                  />
               </div>
            </div>
            {
               loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please wait </Button> : <Button type="submit" className="w-full my-4 bg-black text-white hover:bg-gray-900"> Sign Up </Button>
            }
            <span>Already have an account? <Link to="/login" className="text-blue-600 ">Login</Link> </span>
         </form>
      </div>
    </div>
   )
}

export default Signup
