import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Home = () => {
  const { isAuthenticated } = useAuth();
  return (
    <section className="hero">
      <div className="hero__bg"></div>
      <div className="container hero__content">
        <h1>Bienvenido a Movie Box</h1>
        <p>
          El marketplace cinematográfico más completo de México. Descubre las mejores películas, 
          clásicos y estrenos.
        </p>
        <div className="hero__cta">
          <Link to="/catalog" className="btn btn--primary">
            🎬 Explorar Cartelera
          </Link>
          {isAuthenticated && (
            <Link to="/profile" className="btn btn--ghost">
              👤 Mi Cuenta
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
export default Home;