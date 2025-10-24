import React, { useEffect } from 'react'
import { JOB_API_END_POINT } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setAllJobs } from '../redux/jobSlice';
import axios from 'axios';

//A custom hook is basically a JavaScript function that:
//1.Starts with use (e.g., useGetAllJobs)
//2.Can use other React hooks (useState, useEffect, etc.) inside it
//3.Encapsulates reusable logic
//4.Returns data or functions to be used in a component
//Short version: a custom hook is a function designed to reuse React logic.

const useGetAllJobs = () => {
   const dispatch = useDispatch();
   const {searchedQuery} = useSelector(store => store.job);

   useEffect(()=>{
      const fetchAllJobs = async () => { //define the function
         try{
            const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`,{withCredentials:true}); //withCredentials: true --> This option tells Axios to include cookies, authorization headers, or TLS client certificates when making a cross-origin HTTP request.
            //If the API call succeeded, update my Redux store with all the jobs returned from the server.
            if(res.data.success){
               dispatch(setAllJobs(res.data.jobs)); //Sends the job array from the backend to the Redux store using the setAllJobs action.
            } 
         } catch(error){
            console.log(error);
         }
      }
      fetchAllJobs(); //call the function
   },[searchedQuery]);
}

export default useGetAllJobs
