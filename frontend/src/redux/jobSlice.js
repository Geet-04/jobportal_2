import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
   //Creates a slice of the Redux store called "job". A slice represents a specific part of your global state (here, jobs-related data).
   name:"job",
   initialState:{  //Defines the initial state of this slice — here it starts with an empty array alljobs.
      allJobs: [],
      allAdminJobs:[],
      singleJob : null,
      searchJobByText:"",
      allAppliedJobs:[],
      searchedQuery:"", // global variable to store the search text
   },
   reducers:{ //reducers contain functions that modify the state.
      //actions
      setAllJobs:(state,action) => {   //setAllJobs is an action reducer — it updates the allJobs array with whatever data comes in action.payload. For example:dispatch(setAllJobs([{title: "Frontend Dev"}, {title: "Backend Dev"}]))→ This replaces allJobs with the new array of jobs.
         state.allJobs = action.payload;
      },
      setSingleJob:(state,action) => {
         state.singleJob = action.payload;
      },
      setAllAdminJobs:(state,action) => {   //setAllJobs is an action reducer — it updates the allJobs array with whatever data comes in action.payload. For example:dispatch(setAllJobs([{title: "Frontend Dev"}, {title: "Backend Dev"}]))→ This replaces allJobs with the new array of jobs.
         state.allAdminJobs = action.payload;
      },
      setSearchJobByText:(state,action) => {
         state.searchJobByText = action.payload;
      },
      setAllAppliedJobs:(state,action) => {
         state.allAppliedJobs = action.payload;
      },
      setSearchedQuery:(state,action) => {
         state.searchedQuery = action.payload;
      }
   }
});
export const { setAllJobs , setSingleJob, setAllAdminJobs, setSearchJobByText, setAllAppliedJobs, setSearchedQuery } = jobSlice.actions;
export default jobSlice.reducer;