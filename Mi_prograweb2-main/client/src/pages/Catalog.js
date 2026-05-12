import React from 'react';
import MovieFilters from '../components/movies/MovieFilters';
import MovieGrid from '../components/movies/MovieGrid';
import { useMovies } from '../context/MovieContext';

const Catalog = () => {
  const { movies } = useMovies();

  return (
    <section className="section container">
      <div className="section__head">
        <h2>Catalogo de peliculas</h2>
        <p>Encuentra titulos por director, anio y genero en Movie Box.</p>
      </div>

      <MovieFilters />

      <div className="movie-count">
        {movies.length} {movies.length === 1 ? 'pelicula encontrada' : 'peliculas encontradas'}
      </div>

      <MovieGrid />
    </section>
  );
};

export default Catalog;
