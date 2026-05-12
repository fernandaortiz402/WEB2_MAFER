import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const normalize = (r) => (r || '').toString().trim().toLowerCase();

const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (roles && roles.length) {
    const allowed = roles.map(normalize);
    if (!allowed.includes(normalize(currentUser?.Rol))) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
