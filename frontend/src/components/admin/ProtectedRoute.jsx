import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({children}) => {
   const {User} = useSelector(store => store.auth);
   const navigate = useNavigate();

   useEffect(() => {
      // If user is loaded, check role
      if (User !== undefined && (User === null || User.role !== 'recruiter')) {
         navigate("/", { replace: true });
      }
   },[User, navigate]);

   return (
    <>
      {children}
    </>
  )
}

export default ProtectedRoute;
