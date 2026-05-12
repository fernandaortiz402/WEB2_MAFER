import axios from 'axios';

const API_URL = '/api/users';

function extractApiError(error, fallback) {
  const data = error.response?.data;
  if (data && typeof data === 'object') {
    const main = data.error || data.message;
    const extra = data.details;
    const combined = [main, extra].filter(Boolean).join(' — ');
    if (combined) return combined;
  }
  if (typeof data === 'string' && data.trim()) return data;
  if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
    return 'Error de conexión: comprueba que el API esté en ejecución (http://localhost:3000) y el proxy del cliente.';
  }
  return error.message || fallback;
}

const authService = {
  register: async (userData) => {
    try {
      const fd = new FormData();
      fd.append('Nombre_usuario', userData.nombre_usuario);
      fd.append('Correo', userData.correo);
      fd.append('Contrasenia', userData.contrasenia);
      fd.append('Sexo', userData.sexo);
      fd.append('Rol', userData.tipo_usuario);
      fd.append('Telefono', userData.telefono);
      if (userData.fotoPerfil) {
        fd.append('fotoPerfil', userData.fotoPerfil);
      }

      // No Content-Type manual: el navegador envía multipart + boundary
      const response = await axios.post(`${API_URL}/register`, fd, {
        headers: { Accept: 'application/json' }
      });

      return {
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      throw new Error(extractApiError(error, 'Error en el registro'));
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { Correo: email, Contrasenia: password },
        {
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
        }
      );

      return {
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      throw new Error(extractApiError(error, 'Error en el login'));
    }
  }
};

export default authService;
