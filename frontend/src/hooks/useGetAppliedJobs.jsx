import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { APPLICATION_API_END_POINT } from '../utils/constant';
import { setAllAppliedJobs } from '../redux/jobSlice';

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();

  useEffect(()=> {
    const fetchAppliedJobs = async () => {
      try{
        const res = await axios.get(`${APPLICATION_API_END_POINT}/get`,{withCredentials:true});
        if(res.data.success){
          dispatch(setAllAppliedJobs(res.data.application)); //We send res.data.application(array of applications) comes from backend in dispatch to update the Redux store with the fetched jobs so that any component can access them globally.
        }
      } catch(error){
        console.log(error);
      }
    }
    fetchAppliedJobs();
  },[]);
}

export default useGetAppliedJobs;
