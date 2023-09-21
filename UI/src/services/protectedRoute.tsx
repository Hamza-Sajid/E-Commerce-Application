import Cookies from 'js-cookie';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const token = Cookies.get('token');
  return token ? <Outlet /> : <Navigate to={'/login'} />;
}

export default ProtectedRoute;
