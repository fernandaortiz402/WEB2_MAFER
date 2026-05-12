import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

/**
 * Fade-in al cambiar entre rutas hijas (catálogo ↔ detalle).
 */
const PageTransitionLayout = () => {
  const { pathname } = useLocation();
  return (
    <div className="page-transition-root" key={pathname}>
      <Outlet />
    </div>
  );
};

export default PageTransitionLayout;
