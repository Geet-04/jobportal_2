import React, { useEffect } from 'react'
import { COMPANY_API_END_POINT } from '../utils/constant';
import { useDispatch } from 'react-redux';
import { setAllJobs } from '../redux/jobSlice';
import axios from 'axios';
import { Company } from './../../../backend/models/companyModel';
import { setSingleCompany } from '../redux/companySlice';

const useGetCompanyById = (companyId) => {
   const dispatch = useDispatch();

  useEffect(()=>{
   const fetchSingleCompany = async () => { //define the function
      try{
         const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`,{withCredentials:true}); //withCredentials: true --> This option tells Axios to include cookies, authorization headers, or TLS client certificates when making a cross-origin HTTP request.
         //If the API call succeeded, update my Redux store with all the jobs returned from the server.
         if(res.data.success){
            dispatch(setSingleCompany(res.data.company)); //Sends the job array from the backend to the Redux store using the setAllJobs action.
         } 
      } catch(error){
         console.log(error);
      }
   }
   fetchSingleCompany(); //call the function
  },[])
}

export default useGetCompanyById
