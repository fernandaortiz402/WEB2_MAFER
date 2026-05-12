const API_URL = '/api/orders';

export const orderService = {
  createOrder: async (metodoPago) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ metodoPago })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la orden');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getUserOrders: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener las órdenes');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  getVendorOrders: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/vendor-sales`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener las ventas');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
      throw error;
    }
  },

  getOrderById: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al obtener la orden');
    return data;
  },

  submitOrderReview: async (orderId, payload) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${orderId}/review`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al enviar la reseña');
    return data;
  },

  getReporteVentas: async (fechaInicio, fechaFin) => {
    const token = localStorage.getItem('token');
    const qs = new URLSearchParams();
    if (fechaInicio) qs.append('fechaInicio', fechaInicio);
    if (fechaFin) qs.append('fechaFin', fechaFin);
    const q = qs.toString();
    const response = await fetch(`${API_URL}/reporte-ventas${q ? `?${q}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al obtener el reporte');
    return data;
  }
};