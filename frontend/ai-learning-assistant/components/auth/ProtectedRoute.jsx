import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';

const ProtectedRoute = () => {
    const isAuthenticated = true;
    const isLoading = false;

   if(isLoading){
    return <div>Loading...</div>
   } 

  return isAuthenticated ? (
        <AppLayout>
            <Outlet/>
        </AppLayout>
  ) : (
    <Navigate to="/login" replace/>
  )
}

export default ProtectedRoute
