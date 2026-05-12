import React, { createContext, useState, useContext, useEffect } from 'react';
import { movieService } from '../services/movieService';

const MovieContext = createContext();

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies debe ser usado dentro de un MovieProvider');
  }
  return context;
};

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await movieService.getMovies();

      if (response.success) {
        const formatted = response.movies.map((movie) => ({
          _id: movie._id,
          titulo: movie.Titulo,
          cantidad: movie.Cantidad,
          precio: movie.Precio,
          informacion: movie.Informacion,
          director: movie.Director,
          estudio: movie.Estudio?.Nombre_Estudio || 'Estudio no especificado',
          distribuidor: movie.Distribuidor?.Nombre_usuario || 'Distribuidor no disponible',
          genero: movie.Genero || 'General',
          clasificacion: movie.Clasificacion,
          anio: movie.Anio_Lanzamiento,
          duracion: movie.Duracion,
          image: movie.imagenes?.[0]?.filename
            ? `http://localhost:3000/uploads/${movie.imagenes[0].filename}`
            : 'https://via.placeholder.com/300x400/4A5568/FFFFFF?text=Imagen+No+Disponible',
          releaseDate: movie.createdAt || new Date().toISOString()
        }));

        setMovies(formatted);
        setFilteredMovies(formatted);
      } else {
        setError('Error al cargar las peliculas desde el servidor');
      }
    } catch (err) {
      console.error('Error loading movies:', err);
      setError('Error de conexión con el servidor: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let results = movies;

    if (searchTerm) {
      results = results.filter(
        (movie) =>
          movie.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.genero.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== 'all') {
      results = results.filter((movie) => movie.genero === selectedGenre);
    }

    setFilteredMovies(results);
  }, [searchTerm, selectedGenre, movies]);

  const searchMovies = (term) => {
    setSearchTerm(term);
  };

  const filterByGenre = (genre) => {
    setSelectedGenre(genre);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('all');
  };

  const refreshMovies = () => {
    loadMovies();
  };

  const value = {
    movies: filteredMovies,
    allMovies: movies,
    loading,
    error,
    searchMovies,
    filterByGenre,
    filterByPlatform: filterByGenre,
    clearFilters,
    refreshMovies,
    searchTerm,
    selectedGenre,
    selectedPlatform: selectedGenre
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};
