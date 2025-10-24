import { ArrowLeft, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import { COMPANY_API_END_POINT } from '../../utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { useSelector } from 'react-redux'
import useGetCompanyById from './../../hooks/useGetCompanyById';

const CompanySetup = () => {
   const params = useParams();
   useGetCompanyById(params.id);
   const [input, setInput] = useState({
      name:"",
      description:"",
      website:"",
      location:"",
      file:null
   });

   const {singleCompany} =useSelector(store => store.company);

   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const changeEventHandler = (e) => {
      setInput({...input, [e.target.name]: e.target.value});
   }

   const changeFileHandler = (e) => {
      const file = e.target.files?.[0];
      setInput({...input, file});
   }

   //steps-
   //1.Prevent page reload.
   //2.Pack form inputs + file into FormData.
   //3.Use Axios to send it to backend.
   //4.Show success message and navigate.
   //5.Catch and log errors.
   const submitHandler = async(e) => {
      //step1-Prevent page reload
      e.preventDefault();

      //step2-collect form data
      //formData is just an object in JavaScript that holds your fields and file.
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("website", input.website);
      formData.append("location", input.location);
      if(input.file){
         formData.append("file", input.file);
      }

      //note-The backend (Node/Express, etc.) is not aware of this data until you make a network request.So we use axios to send data stored in formdata tp backend
      //So, in short-
      //FormData = collect all the input values + file. 
      //Axios = send that collected data to your backend.

      //step3-Send data to backend using Axios
      //PUT request updates an existing company (based on params.id).
      //multipart/form-data allows sending files along with text.
      try{
         setLoading(true);
         const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`,formData,{
            headers:{
               'Content-Type':'multipart/form-data'
            },
            withCredentials:true,
         });

         //step4-Handle response
         //If backend says success → show a success toast and navigate back to the companies page.
         if(res.data.success){
            toast.success(res.data.message);
            navigate("/admin/companies");
         }
      } catch(error){  //step5-Handle errors
         console.log(error);
         toast.error(error.response.data.message);
      } finally{
         setLoading(false);
      }
   }

   //When singleCompany data comes from Redux, this hook fills the form with that company’s existing details.
   useEffect(()=> {
       if (singleCompany) {
         setInput({
            name:singleCompany.name || "",
            description:singleCompany.description || "",
            website:singleCompany.website || "",
            location:singleCompany.location || "",
            file:singleCompany.file || null
         });
      } 
   },[singleCompany]);
  return (
    <div>
      <Navbar/>
      <div className='max-w-xl mx-auto my-10'>
         <form onSubmit={submitHandler}>
            <div className='flex items-center gap-5 p-8'>
               <Button onClick={()=> navigate("/admin/companies")}variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                  <ArrowLeft/>
                  <span>Back</span>
               </Button>
               <h1 className='font-bold text-xl'>Company Setup</h1>
            </div>
            <div className='grid grid-cols-2 gap-4'>
               <div className=''>
                  <Label>Company Name</Label>
                  <Input
                     type="text"
                     name="name"
                     value={input.name}
                     onChange={changeEventHandler}
                  />
               </div>
               <div>
                  <Label>Description</Label>
                  <Input
                     type="text"
                     name="description"
                     value={input.description}
                     onChange={changeEventHandler}
                  />
               </div>
               <div>
                  <Label>Website</Label>
                  <Input
                     type="text"
                     name="website"
                     value={input.website}
                     onChange={changeEventHandler}
                  />
               </div>
               <div>
                  <Label>Location</Label>
                  <Input
                     type="text"
                     name="location"
                     value={input.location}
                     onChange={changeEventHandler}
                  />
               </div>
               <div>
                  <Label>Logo</Label>
                  <Input
                     type="file"
                     accept="image/*"
                     onChange={changeFileHandler}
                  />
               </div>
            </div>
            {
               loading ? <Button className="w-full my-4"><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait </Button> : < Button type="submit" className="w-full my-4 bg-black text-white px-4 py-2 rounded">Update</Button>
            }
         </form>
      </div>
    </div>
  )
}

export default CompanySetup
