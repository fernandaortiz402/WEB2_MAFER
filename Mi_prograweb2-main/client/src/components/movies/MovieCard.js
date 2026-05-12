import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import PopcornBurst from '../effects/PopcornBurst';

const MovieCard = ({ movie }) => {
  const cart = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const addBtnRef = useRef(null);
  const [popcorn, setPopcorn] = useState(null);

  const triggerPopcorn = () => {
    const el = addBtnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPopcorn({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  const handleCardClick = () => {
    navigate(`/producto/${movie._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar películas al carrito');
      return;
    }

    try {
      const result = await cart.addToCart(movie._id, 1);
      if (result.success) {
        triggerPopcorn();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Error al agregar al carrito');
    }
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar a lista de deseos');
      return;
    }
    alert(`${movie.titulo} agregada a lista de deseos`);
  };

  return (
    <div className="card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      {popcorn && (
        <PopcornBurst
          anchorX={popcorn.x}
          anchorY={popcorn.y}
          onComplete={() => setPopcorn(null)}
        />
      )}
      <div className="card__image-container">
        <img src={movie.image} alt={movie.titulo} />
      </div>

      <div className="card__body">
        <div className="card__platform">Genero: {movie.genero}</div>
        <h3 className="card__title">{movie.titulo}</h3>
        <div className="card__platform">Distribuidor: {movie.distribuidor}</div>

        <div className="card__price">
          <div>
            <div className="price">${movie.precio} MXN</div>
          </div>
        </div>

        <div className="card__actions">
          <button
            ref={addBtnRef}
            type="button"
            className="btn btn--primary btn--cart-purchase"
            style={{ flex: 1 }}
            onClick={handleAddToCart}
          >
            🍿 Agregar al carrito
          </button>
          <button type="button" className="btn btn--ghost" onClick={handleAddToWishlist}>
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
