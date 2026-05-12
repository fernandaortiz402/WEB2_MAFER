import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { resolveUploadUrl } from '../../utils/uploadUrl';

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  // ✅ Lógica para mostrar opciones según el rol
  const isVendedor = (currentUser?.Rol || '').toLowerCase() === 'vendedor';
  const isCliente =
    currentUser?.Rol === 'Cliente' ||
    currentUser?.Rol === 'Comprador' ||
    (currentUser?.Rol || '').toLowerCase() === 'cliente';

  const profilePhoto =
    isAuthenticated && currentUser?.fotoPerfil
      ? resolveUploadUrl(currentUser.fotoPerfil)
      : null;

  return (
    <header className="nav">
      <div className="nav__inner container">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          🎬 Movie Box
        </Link>
        
        {/* Botón menú hamburguesa para móvil */}
        <button 
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          ☰
        </button>
        
        <nav className={`nav__links ${menuOpen ? 'nav__links--open' : ''}`}>
          {/* Opciones para TODOS los usuarios */}
          <Link to="/catalog" onClick={handleNavClick}>
            <span className="texto-completo">Catálogo</span>
            <span className="solo-icono">📋</span>
          </Link>

          {/* ✅ Opciones solo para VENDEDORES */}
          {isAuthenticated && isVendedor && (
            <>
              <Link to="/nuevo-producto" onClick={handleNavClick}>
                <span className="texto-completo">Nuevo Producto</span>
                <span className="solo-icono">➕</span>
              </Link>
              <Link to="/reporte-ventas" onClick={handleNavClick}>
                <span className="texto-completo">Reportes</span>
                <span className="solo-icono">📊</span>
              </Link>
            </>
          )}

          {/* ✅ Opciones solo para compradores */}
          {isAuthenticated && isCliente && (
            <>
              <Link to="/mis-compras" onClick={handleNavClick}>
                <span className="texto-completo">Mis Compras</span>
                <span className="solo-icono">📦</span>
              </Link>
              <Link to="/cart" className="cart-link" onClick={handleNavClick}>
                <span className="texto-completo">Carrito ({totalItems})</span>
                <span className="solo-icono">🛒 ({totalItems})</span>
              </Link>
            </>
          )}

          {/* Opciones para usuarios AUTENTICADOS (todos los roles) */}
          {isAuthenticated && (
            <Link to="/profile" onClick={handleNavClick} className="nav-profile-link">
              {profilePhoto && (
                <img
                  className="nav__user-thumb"
                  src={profilePhoto}
                  alt=""
                  width={40}
                  height={40}
                />
              )}
              <span className="texto-completo">Mi Perfil</span>
              <span className="solo-icono">👤</span>
            </Link>
          )}
          
          {/* Botón de Login/Logout */}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn btn--ghost">
              <span className="texto-completo">Cerrar Sesión</span>
              <span className="solo-icono">🚪</span>
            </button>
          ) : (
            <Link to="/auth" className="btn btn--primary" onClick={handleNavClick}>
              <span className="texto-completo">Ingresar</span>
              <span className="solo-icono">🔐</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;