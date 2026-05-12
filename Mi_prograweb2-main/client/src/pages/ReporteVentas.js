import React, { useEffect, useState, useCallback } from 'react';
import { orderService } from '../services/orderService';

const ReporteVentas = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [lineas, setLineas] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReporte = useCallback(async (ini, fin) => {
    try {
      setLoading(true);
      setError('');
      const data = await orderService.getReporteVentas(ini || '', fin || '');
      setLineas(data.lineas || []);
      setResumen(data.resumen || null);
    } catch (e) {
      setError(e.message || 'Error al cargar el reporte');
      setLineas([]);
      setResumen(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReporte('', '');
  }, [fetchReporte]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReporte(fechaInicio, fechaFin);
  };

  const fmtFecha = (d) => {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('es-MX', { dateStyle: 'short' });
    } catch {
      return '';
    }
  };

  return (
    <section className="section container mp-page-dark">
      <div className="reporte-ventas">
        <div className="section__head">
          <h2>Reporte de ventas</h2>
          <p>Peliculas vendidas como distribuidor en Movie Box</p>
        </div>

        <div className="reporte-content mp-card-rounded">
          <form onSubmit={handleSubmit} className="filtros-form">
            <div className="filtros-row">
              <div className="form-group">
                <label htmlFor="fecha_inicio">Fecha inicio</label>
                <input
                  type="date"
                  id="fecha_inicio"
                  className="form-control"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <span className="filtro-separador">a</span>
              <div className="form-group">
                <label htmlFor="fecha_fin">Fecha fin</label>
                <input
                  type="date"
                  id="fecha_fin"
                  className="form-control"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn--primary">
                Aplicar filtros
              </button>
            </div>
          </form>

          {error && <div className="error-message" style={{ padding: '1rem' }}>{error}</div>}
          {loading && <div className="loading" style={{ padding: '2rem' }}>Cargando...</div>}

          {!loading && (
            <div className="tabla-container mp-table-wrap">
              <table className="tabla-ventas mp-table-fucsia">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Producto (Titulo)</th>
                    <th>Distribuidor / Estudio</th>
                    <th>Cantidad</th>
                    <th>Precio unitario</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lineas.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)' }}>
                        No hay ventas en el rango seleccionado
                      </td>
                    </tr>
                  ) : (
                    lineas.map((row, idx) => (
                      <tr key={`${row.ordenId}-${idx}`}>
                        <td>{fmtFecha(row.fecha)}</td>
                        <td>{row.titulo}</td>
                        <td>{row.distribuidorEstudio}</td>
                        <td>{row.cantidad}</td>
                        <td>${Number(row.precioUnitario).toFixed(2)} MXN</td>
                        <td>${Number(row.total).toFixed(2)} MXN</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {resumen && (
            <div className="resumen-ventas">
              <h3>Resumen de ventas</h3>
              <div className="resumen-grid">
                <div className="resumen-card">
                  <div className="resumen-icon">💰</div>
                  <div className="resumen-valor">${Number(resumen.totalVentas).toFixed(2)} MXN</div>
                  <div className="resumen-label">Ventas totales</div>
                </div>
                <div className="resumen-card">
                  <div className="resumen-icon">🎬</div>
                  <div className="resumen-valor">{resumen.totalUnidades}</div>
                  <div className="resumen-label">Peliculas vendidas (unidades)</div>
                </div>
                <div className="resumen-card">
                  <div className="resumen-icon">📊</div>
                  <div className="resumen-valor">${Number(resumen.promedioPorVenta).toFixed(2)} MXN</div>
                  <div className="resumen-label">Promedio por venta</div>
                </div>
                <div className="resumen-card">
                  <div className="resumen-icon">🧾</div>
                  <div className="resumen-valor">{resumen.numTransacciones}</div>
                  <div className="resumen-label">Transacciones</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReporteVentas;
