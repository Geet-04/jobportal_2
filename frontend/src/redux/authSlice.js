import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
   name:"auth",
   initialState:{
      loading:false, //state
      User:null
   },
   reducers:{ //key value pair action: reducer(function)
      //actions
      setLoading:(state, actions) => {
         state.loading = actions.payload;
      },
      setUser:(state, actions) => {
         state.User = actions.payload;
      }
   }
});
export const {setLoading, setUser} = authSlice.actions;
export default authSlice.reducer;