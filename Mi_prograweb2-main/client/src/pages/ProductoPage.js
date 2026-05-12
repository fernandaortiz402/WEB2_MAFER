import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { movieService } from '../services/movieService';
import PopcornBurst from '../components/effects/PopcornBurst';

const ProductoPage = () => {
  const { id: movieId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const addBtnRef = useRef(null);
  const [cantidad, setCantidad] = useState(1);
  const [imagenPrincipal, setImagenPrincipal] = useState(0);
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popcorn, setPopcorn] = useState(null);

  const triggerPopcorn = () => {
    const el = addBtnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPopcorn({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await movieService.getMovieById(movieId);

        if (response.success) {
          const movieData = response.movie;
          const formattedProduct = {
            _id: movieData._id,
            titulo: movieData.Titulo,
            precio: movieData.Precio,
            cantidad: movieData.Cantidad,
            informacion: movieData.Informacion,
            distribuidor: movieData.Distribuidor?.Nombre_usuario || 'Distribuidor no disponible',
            genero: movieData.Genero || 'General',
            director: movieData.Director,
            estudio: movieData.Estudio?.Nombre_Estudio || 'Estudio no especificado',
            rating: 4.5,
            images:
              movieData.imagenes && movieData.imagenes.length > 0
                ? movieData.imagenes.map((img) => `http://localhost:3000/uploads/${img.filename}`)
                : ['https://via.placeholder.com/600x400/4A5568/FFFFFF?text=Imagen+No+Disponible']
          };

          setProducto(formattedProduct);
        } else {
          setError('Error al cargar el producto');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      loadProduct();
    }
  }, [movieId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      navigate('/auth');
      return;
    }

    if (!producto) return;

    try {
      const result = await addToCart(producto._id, cantidad);
      if (result.success) {
        triggerPopcorn();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Error al agregar al carrito');
    }
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar a lista de deseos');
      navigate('/auth');
      return;
    }
    alert(`${producto.titulo} agregada a lista de deseos`);
  };

  if (loading) {
    return (
      <section className="section container">
        <div className="loading">Cargando producto...</div>
      </section>
    );
  }

  if (error || !producto) {
    return (
      <section className="section container">
        <div className="error">
          <p>{error || 'Producto no encontrado'}</p>
          <button type="button" onClick={() => navigate('/catalog')}>
            Volver al catálogo
          </button>
        </div>
      </section>
    );
  }

  const backdropUrl = producto.images?.[imagenPrincipal] || producto.images?.[0];

  return (
    <section className="producto-cine-shell">
      <div
        className="producto-cine-backdrop"
        style={{ backgroundImage: `url(${backdropUrl})` }}
        aria-hidden
      />
      <div className="producto-cine-scrim" aria-hidden />
      <div className="producto-cine-inner container">
        {popcorn && (
          <PopcornBurst
            anchorX={popcorn.x}
            anchorY={popcorn.y}
            onComplete={() => setPopcorn(null)}
          />
        )}
        <div className="producto-page">
          <div className="producto-content">
            <aside className="producto-gallery">
              <div className="imagen-principal">
                <img
                  src={producto.images[imagenPrincipal]}
                  alt={producto.titulo}
                  className="producto-imagen"
                />
              </div>

              {producto.images.length > 1 && (
                <div className="miniaturas">
                  {producto.images.map((imagen, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`miniatura-btn ${imagenPrincipal === index ? 'active' : ''}`}
                      onClick={() => setImagenPrincipal(index)}
                      aria-label={`Ver imagen ${index + 1}`}
                    >
                      <img
                        src={imagen}
                        alt={`Miniatura ${index + 1}`}
                        className="miniatura-imagen"
                      />
                    </button>
                  ))}
                </div>
              )}
            </aside>

            <main className="producto-details">
              <div className="producto-header">
                <h1>{producto.titulo}</h1>
                <button
                  type="button"
                  className="wishlist-btn"
                  onClick={handleAddToWishlist}
                  aria-label="Agregar a favoritos"
                >
                  ♡
                </button>
              </div>

              <div className="producto-platform">
                <span className="platform-badge">Genero: {producto.genero}</span>
                <div className="producto-rating">
                  <span className="stars">★★★★☆</span>
                  <span>({producto.rating})</span>
                </div>
              </div>

              <div className="producto-precio">
                <strong className="precio">${producto.precio} MXN</strong>
              </div>

              <section className="producto-descripcion">
                <h2>Sobre esta película</h2>
                <p>{producto.informacion}</p>
                <ul className="producto-caracteristicas">
                  <li>🎬 Director: {producto.director}</li>
                  <li>🏢 Estudio: {producto.estudio}</li>
                  <li>📦 Disponibles: {producto.cantidad} unidades</li>
                  <li>🚚 Envío gratis en compras mayores a $500 MXN</li>
                </ul>
              </section>

              <form className="purchase-form" onSubmit={(e) => e.preventDefault()}>
                <div className="cantidad-group">
                  <label htmlFor="cantidad">Cantidad</label>
                  <div className="cantidad-controls">
                    <button
                      type="button"
                      className="cantidad-btn"
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    >
                      -
                    </button>
                    <input
                      id="cantidad"
                      name="cantidad"
                      type="number"
                      min="1"
                      max={producto.cantidad}
                      value={cantidad}
                      onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="cantidad-input"
                    />
                    <button
                      type="button"
                      className="cantidad-btn"
                      onClick={() => setCantidad(Math.min(producto.cantidad, cantidad + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="vendedor-info">
                  <p>
                    🛍️ <strong>Distribuidor:</strong> {producto.distribuidor}
                  </p>
                  <p>
                    📦 <strong>Disponibles:</strong> {producto.cantidad} unidades
                  </p>
                  <p>
                    🏢 <strong>Estudio:</strong> {producto.estudio}
                  </p>
                </div>

                <div className="producto-actions">
                  <button
                    ref={addBtnRef}
                    type="button"
                    className="btn btn--primary btn--large btn--cart-purchase"
                    onClick={handleAddToCart}
                    disabled={producto.cantidad === 0}
                  >
                    {producto.cantidad === 0 ? '❌ Agotado' : '🛒 Agregar al Carrito'}
                  </button>
                  <button
                    type="button"
                    className="btn btn--accent btn--large"
                    disabled={producto.cantidad === 0}
                  >
                    {producto.cantidad === 0 ? 'No Disponible' : '💳 Comprar Ahora'}
                  </button>
                </div>
              </form>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductoPage;
