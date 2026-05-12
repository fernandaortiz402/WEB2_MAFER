import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NuevoProducto = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [categorias, setCategorias] = useState([]); 
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plataformasResponse, categoriasResponse, companiasResponse] = await Promise.all([
          Promise.resolve({ data: { platforms: [] } }),
          axios.get('/api/categories'),
          axios.get('/api/studios')
        ]);

        void plataformasResponse;
        setCategorias(categoriasResponse.data.categories || []);
        setStudios(companiasResponse.data.studios || []);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Obtener el token de autenticación
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      console.log('🔍 CurrentUser del localStorage:', currentUser);

      if (!currentUser) {
        alert('Debes iniciar sesión para crear un producto');
        setSubmitting(false);
        return;
      }

      // OBTENER EL TOKEN - Esta es la parte clave que falta
      const token = localStorage.getItem('token') || currentUser.token;
      console.log('🔑 Token obtenido:', token ? '✅ Sí' : '❌ No');

      if (!token) {
        alert('Error de autenticación. Vuelve a iniciar sesión.');
        setSubmitting(false);
        return;
      }

      // Mostrar datos que se enviarán
      console.log('📝 Datos del formulario:');
      console.log('   - Usuario ID:', currentUser.id || currentUser._id);
      console.log('   - Token:', token ? 'Presente' : 'Faltante');

      // Crear FormData
      const formData = new FormData();
      formData.append('titulo', e.target.titulo.value);
      formData.append('director', e.target.director.value);
      formData.append('duracion', e.target.duracion.value);
      formData.append('anio', e.target.anio.value);
      formData.append('clasificacion', e.target.clasificacion.value);
      formData.append('genero', e.target.genero.value);
      formData.append('cantidad', e.target.cantidad.value);
      formData.append('precio', e.target.precio.value);
      formData.append('informacion', e.target.informacion.value);
      formData.append('categoria', e.target.categoria.value);
      
      if (e.target.estudio.value) {
        formData.append('estudio', e.target.estudio.value);
      }

      // Agregar imágenes
      selectedImages.forEach((image) => {
        formData.append('imagenes', image);
      });

      console.log('📤 Enviando formulario CON token...');
      
      // ENVIAR CON TOKEN - Esta es la corrección principal
      const response = await axios.post('/api/movies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`  // ✅ AGREGAR ESTA LÍNEA
        }
      });

      if (response.data.success) {
        alert('✅ Producto creado exitosamente!');
        console.log('Pelicula creada:', response.data.movie);
        
        // Limpiar formulario
        e.target.reset();
        setSelectedImages([]);
      }
      
    } catch (error) {
      console.error('❌ Error al crear producto:', error);
      alert(`❌ Error: ${error.response?.data?.error || 'No se pudo crear el producto'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="section container">
        <div className="loading">Cargando datos...</div>
      </section>
    );
  }

  return (
    <section className="section container">
      <div className="nuevo-producto">
        <div className="section__head">
          <h2>➕ Nuevo Producto</h2>
          <p>Agrega una nueva pelicula al catalogo</p>
        </div>

        <form onSubmit={handleSubmit} className="producto-form">
          <div className="form-group">
            <label htmlFor="titulo">Titulo</label>
            <input 
              type="text" 
              id="titulo"
              name="titulo" 
              className="form-control"
              placeholder="Ej: Inception"
              required
            />
          </div>

          <div className="fila">
            <div className="form-group">
              <label htmlFor="director">Director</label>
              <input type="text" id="director" name="director" className="form-control" required />
            </div>
            <div className="form-group">
              <label htmlFor="duracion">Duracion (min)</label>
              <input type="number" id="duracion" name="duracion" className="form-control" min="1" required />
            </div>
          </div>

          <div className="fila">
            <div className="form-group">
              <label htmlFor="anio">Anio de lanzamiento</label>
              <input type="number" id="anio" name="anio" className="form-control" min="1900" required />
            </div>
            <div className="form-group">
              <label htmlFor="clasificacion">Clasificacion</label>
              <input type="text" id="clasificacion" name="clasificacion" className="form-control" placeholder="PG-13, R..." required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="genero">Genero</label>
            <select id="genero" name="genero" className="form-select" required>
              <option value="">Selecciona un genero</option>
              <option value="Accion">Accion</option>
              <option value="Drama">Drama</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Comedia">Comedia</option>
            </select>
          </div>

          <div className="fila">
            <div className="form-group">
              <label htmlFor="cantidad">Cantidad</label>
              <input 
                type="number" 
                id="cantidad"
                name="cantidad" 
                className="form-control"
                min="1"
                placeholder="0"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="precio">Precio</label>
              <input 
                type="number" 
                id="precio"
                name="precio" 
                step="0.01" 
                className="form-control"
                min="0"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="informacion">Informacion de la pelicula</label>
            <textarea 
              id="informacion"
              name="informacion" 
              className="form-control"
              rows="4"
              placeholder="Descripcion de la pelicula..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoría</label>
            <select id="categoria" name="categoria" className="form-select" required>
              <option value="">Selecciona una categoría</option>
              {categorias.map(categoria => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="estudio">Estudio</label>
            <select id="estudio" name="estudio" className="form-select">
              <option value="">Selecciona un estudio (opcional)</option>
              {studios.map((studio) => (
                <option key={studio._id} value={studio._id}>
                  {studio.Nombre_Estudio}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imagenes">Imagenes de la pelicula</label>
            <input 
              type="file" 
              id="imagenes"
              name="imagenes" 
              multiple 
              accept="image/*"
              className="form-control"
              onChange={handleImageChange}
              required
            />
            <small className="form-help">
              Selecciona una o más imágenes. La primera será la imagen principal.
              {selectedImages.length > 0 && (
                <span className="selected-count">
                  ✅ {selectedImages.length} imagen(es) seleccionada(s)
                </span>
              )}
            </small>
            
            {/* Vista previa de imágenes seleccionadas */}
            {selectedImages.length > 0 && (
              <div className="image-preview">
                <h4>Vista previa:</h4>
                <div className="preview-grid">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="preview-item">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Vista previa ${index + 1}`}
                        className="preview-image"
                      />
                      <span className="preview-label">
                        {index === 0 ? 'Principal' : `Galería ${index}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting ? '⏳ Creando...' : '🎬 Crear Pelicula'}
            </button>
            <button type="button" className="btn btn--ghost">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NuevoProducto;