import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';

const API_BASE = 'http://localhost:3000';

const labelPago = (m) => (m === 'tarjeta' ? 'Tarjeta' : m === 'transferencia' ? 'Transferencia' : m || '-');

const DetalleCompra = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [sending, setSending] = useState(false);
  const [comunidad, setComunidad] = useState([]);

  const loadComments = useCallback(async (movieId) => {
    if (!movieId) return;
    try {
      const res = await fetch(`/api/comments/movie/${movieId}`);
      const data = await res.json();
      setComunidad(data.comments || []);
    } catch {
      setComunidad([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrderById(id);
        if (cancelled) return;
        setOrder(data.order);
        const firstId = data.order?.items?.[0]?.movie?._id || data.order?.items?.[0]?.movie;
        const sid = firstId ? String(firstId) : '';
        setSelectedMovieId(sid);
        if (sid) await loadComments(sid);
      } catch (e) {
        if (!cancelled) setError(e.message || 'No se pudo cargar la compra');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id, loadComments]);

  const posterUrl = (movie) => {
    const fn = movie?.imagenes?.[0]?.filename;
    if (fn) return `${API_BASE}/uploads/${fn}`;
    return 'https://via.placeholder.com/300x400/003399/fff000?text=Movie+Box';
  };

  const handleSubmitResena = async (e) => {
    e.preventDefault();
    if (!selectedMovieId) {
      alert('Selecciona una pelicula para calificar');
      return;
    }
    setSending(true);
    try {
      await orderService.submitOrderReview(id, {
        movieId: selectedMovieId,
        Calificacion: calificacion,
        Comentario: comentario
      });
      alert('Gracias por tu calificacion');
      setComentario('');
      await loadComments(selectedMovieId);
    } catch (err) {
      alert(err.message || 'Error al enviar');
    } finally {
      setSending(false);
    }
  };

  const renderEstrellas = (numeroEstrellas, interactivo = false) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <span
          key={i}
          className={`estrella ${i <= numeroEstrellas ? 'activa' : ''} ${interactivo ? 'interactiva' : ''}`}
          onClick={interactivo ? () => setCalificacion(i) : undefined}
          style={{ cursor: interactivo ? 'pointer' : 'default' }}
        >
          {i <= numeroEstrellas ? '★' : '☆'}
        </span>
      );
    }
    return estrellas;
  };

  if (loading) {
    return (
      <section className="section container mp-page-dark">
        <div className="loading">Cargando detalle...</div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="section container mp-page-dark">
        <div className="error">
          <p>{error || 'Compra no encontrada'}</p>
          <button type="button" className="btn btn--primary" onClick={() => navigate('/mis-compras')}>
            Volver a mis compras
          </button>
        </div>
      </section>
    );
  }

  const totalCantidad = order.items?.reduce((a, it) => a + (it.cantidad || 0), 0) || 0;
  const fechaStr = order.fecha
    ? new Date(order.fecha).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })
    : '';

  return (
    <section className="section container mp-page-dark">
      <div className="detalle-compra">
        <div className="section__head">
          <h2>Detalle de compra</h2>
          <p>Resumen de la transaccion y calificacion</p>
        </div>

        <div className="compra-content mp-card-rounded">
          {order.items?.map((it) => {
            const m = it.movie;
            const mid = m?._id || it.movie;
            const titulo = m?.Titulo || it.titulo;
            const genero = m?.Genero || '—';
            return (
              <section key={String(mid)} className="producto-section">
                <div className="producto-header-corregido">
                  <div className="producto-imagen-corregido">
                    <img src={posterUrl(m)} alt={titulo} className="imagen-producto-corregido" />
                  </div>
                  <div className="producto-info-corregido">
                    <p className="fecha-compra">
                      Comprado el: <strong>{fechaStr}</strong>
                    </p>
                    <h3>{titulo}</h3>
                    <p className="plataforma genero-etiqueta">Genero: {genero}</p>
                    <p className="fecha-compra">
                      Cantidad: <strong>{it.cantidad}</strong> · Precio unitario:{' '}
                      <strong>${Number(it.precio).toFixed(2)} MXN</strong> · Subtotal:{' '}
                      <strong>${Number(it.subtotal).toFixed(2)} MXN</strong>
                    </p>
                  </div>
                </div>
              </section>
            );
          })}

          <section className="detalles-section">
            <h3>Informacion de la transaccion</h3>
            <div className="detalles-grid">
              <div className="detalle-item">
                <span className="detalle-label">Fecha de compra:</span>
                <span className="detalle-valor">{fechaStr}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Metodo de pago:</span>
                <span className="detalle-valor">{labelPago(order.metodoPago)}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Cantidad total de unidades:</span>
                <span className="detalle-valor">{totalCantidad}</span>
              </div>
              <div className="detalle-item total">
                <span className="detalle-label">Total pagado:</span>
                <span className="detalle-valor">${Number(order.total).toFixed(2)} MXN</span>
              </div>
            </div>
          </section>

          <section className="calificacion-section">
            <h3>Califica tu compra</h3>
            {order.items?.length > 1 && (
              <div className="form-group">
                <label htmlFor="pelicula-calif">Pelicula a calificar</label>
                <select
                  id="pelicula-calif"
                  className="form-select"
                  value={selectedMovieId}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSelectedMovieId(v);
                    loadComments(v);
                  }}
                >
                  {order.items.map((it) => {
                    const mid = it.movie?._id || it.movie;
                    const tit = it.movie?.Titulo || it.titulo;
                    return (
                      <option key={String(mid)} value={String(mid)}>
                        {tit}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
            <div className="calificacion-content">
              <div className="estrellas-calificacion">
                <p>¿Como calificarias esta pelicula?</p>
                <div className="estrellas-container">
                  {renderEstrellas(calificacion, true)}
                  <span className="calificacion-texto">({calificacion} de 5)</span>
                </div>
              </div>

              <form onSubmit={handleSubmitResena} className="comentario-form">
                <div className="form-group">
                  <label htmlFor="comentario">Comentario</label>
                  <textarea
                    id="comentario"
                    name="comentario"
                    rows="4"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    className="form-control"
                    placeholder="Comparte tu experiencia..."
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn--primary" disabled={sending}>
                    {sending ? 'Enviando...' : 'Enviar calificacion'}
                  </button>
                </div>
              </form>
            </div>
          </section>

          <section className="comentarios-section">
            <h3>Comentarios de la comunidad</h3>
            <div className="comentarios-list">
              {comunidad.length === 0 ? (
                <p style={{ color: 'var(--muted)' }}>Sin comentarios aun para esta pelicula.</p>
              ) : (
                comunidad.map((c) => (
                  <div key={c._id} className="comentario-item">
                    <div className="comentario-header">
                      <span className="usuario">{c.user?.Nombre_usuario || 'Usuario'}</span>
                    </div>
                    <p className="comentario-texto">{c.Comentario}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default DetalleCompra;
