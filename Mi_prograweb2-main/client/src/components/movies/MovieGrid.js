import React from 'react';
import { useMovies } from '../../context/MovieContext';
import MovieCard from './MovieCard';

const MovieGrid = () => {
  const { movies, loading } = useMovies();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Cargando peliculas...</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="no-results">
        <h3>No se encontraron peliculas</h3>
        <p>Intenta ajustar los filtros de busqueda</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
