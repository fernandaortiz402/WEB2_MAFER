import React from 'react';
import { useMovies } from '../../context/MovieContext';

const MovieFilters = () => {
  const { searchMovies, filterByPlatform, clearFilters, searchTerm, selectedPlatform } = useMovies();

  const genres = [
    { value: 'all', label: 'Todos' },
    { value: 'Accion', label: 'Accion' },
    { value: 'Drama', label: 'Drama' },
    { value: 'Sci-Fi', label: 'Sci-Fi' },
    { value: 'Comedia', label: 'Comedia' }
  ];

  return (
    <div className="filters-section">
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar peliculas por titulo, director o genero..."
          value={searchTerm}
          onChange={(e) => searchMovies(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filters">
        {genres.map((genre) => (
          <button
            key={genre.value}
            type="button"
            className={`filter-btn ${selectedPlatform === genre.value ? 'active' : ''}`}
            onClick={() => filterByPlatform(genre.value)}
          >
            {genre.label}
          </button>
        ))}

        {(searchTerm || selectedPlatform !== 'all') && (
          <button type="button" className="filter-btn" onClick={clearFilters}>
            ✕ Limpiar
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieFilters;
