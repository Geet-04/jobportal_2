import React, { useEffect } from 'react'
import { JOB_API_END_POINT } from '../utils/constant';
import { useDispatch } from 'react-redux';
import { setAllAdminJobs, setAllJobs } from '../redux/jobSlice';
import axios from 'axios'; 

const useGetAllAdminJobs = () => {
   const dispatch = useDispatch();

  useEffect(()=>{
   const fetchAllJobs = async () => { //define the function
      try{
         const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`,{withCredentials:true}); //withCredentials: true --> This option tells Axios to include cookies, authorization headers, or TLS client certificates when making a cross-origin HTTP request.
         //If the API call succeeded, update my Redux store with all the jobs returned from the server.
         if(res.data.success){
            dispatch(setAllAdminJobs(res.data.jobs)); //Sends the job array from the backend to the Redux store using the setAllJobs action.
         } 
      } catch(error){
         console.log(error);
      }
   }
   fetchAllJobs(); //call the function
  },[[dispatch]])
}

export default useGetAllAdminJobs
