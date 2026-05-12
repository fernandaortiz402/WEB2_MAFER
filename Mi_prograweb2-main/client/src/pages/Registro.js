import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Registro = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    correo: '',
    contrasenia: '',
    confirmPassword: '',
    sexo: '',
    telefono: '',
    tipo_usuario: ''
  });
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];
    setFotoPerfil(file || null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.contrasenia !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    const result = await register({ ...formData, fotoPerfil });

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Crear Cuenta</h2>
        <p>Unete a Movie Box</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="fotoPerfil">Foto de perfil</label>
          <input
            type="file"
            id="fotoPerfil"
            name="fotoPerfil"
            accept="image/*"
            className="form-control"
            onChange={handleFotoChange}
          />
          {previewUrl && (
            <div className="registro-preview">
              <img src={previewUrl} alt="Vista previa perfil" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="nombre_usuario">Nombre de usuario</label>
          <input
            type="text"
            id="nombre_usuario"
            name="nombre_usuario"
            value={formData.nombre_usuario}
            onChange={handleChange}
            className="form-control"
            placeholder="Tu nombre de usuario"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo electronico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="form-control"
            placeholder="tu@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contrasenia">Contrasena</label>
          <input
            type="password"
            id="contrasenia"
            name="contrasenia"
            value={formData.contrasenia}
            onChange={handleChange}
            className="form-control"
            placeholder="Crea una contrasena segura"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar contrasena</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-control"
            placeholder="Repite tu contrasena"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipo_usuario">Tipo de cuenta</label>
          <select
            id="tipo_usuario"
            name="tipo_usuario"
            value={formData.tipo_usuario}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Selecciona Cliente o Vendedor</option>
            <option value="Cliente">Cliente — compra películas y califica tus compras</option>
            <option value="vendedor">Vendedor — publica películas y consulta reportes</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sexo">Sexo</label>
          <select
            id="sexo"
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Selecciona tu sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
            <option value="Prefiero no decirlo">Prefiero no decirlo</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Telefono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="form-control"
            placeholder="Tu numero de telefono"
            required
          />
        </div>

        {error && (
          <div className="error-message" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
          <div className="form-switch">
            ¿Ya tienes cuenta?{' '}
            <button type="button" onClick={onSwitchToLogin} className="link-button">
              Inicia sesion
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Registro;
