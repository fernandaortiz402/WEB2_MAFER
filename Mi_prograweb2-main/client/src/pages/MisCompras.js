import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';

const MisCompras = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await orderService.getUserOrders();
        setOrders(data.orders || []);
      } catch (e) {
        setError(e.message || 'No se pudieron cargar las compras');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatFecha = (d) => {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('es-MX', { dateStyle: 'medium' });
    } catch {
      return String(d);
    }
  };

  return (
    <section className="section container mp-page-dark">
      <div className="mis-compras">
        <div className="section__head">
          <h2>Mis Compras</h2>
          <p>Historial de ordenes realizadas en Movie Box</p>
        </div>

        {loading && <div className="loading">Cargando compras...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && (
          <div className="compras-list mp-card-rounded">
            {orders.length === 0 ? (
              <p className="text-center" style={{ padding: '2rem', color: 'var(--muted)' }}>
                Aun no tienes compras. Visita el catalogo.
              </p>
            ) : (
              orders.map((orden) => {
                const first = orden.items?.[0];
                const titulo = first?.movie?.Titulo || first?.titulo || 'Pelicula';
                return (
                  <div key={orden._id} className="compra-item">
                    <div className="compra-info">
                      <h3>{titulo}</h3>
                      <p>
                        {formatFecha(orden.fecha)} · ${Number(orden.total).toFixed(2)} MXN ·{' '}
                        {orden.metodoPago === 'tarjeta' ? 'Tarjeta' : 'Transferencia'}
                      </p>
                    </div>
                    <div className="compra-actions">
                      <Link to={`/detalle-compra/${orden._id}`} className="btn btn--primary">
                        Ver detalle
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MisCompras;
