export const movieService = {
  getMovies: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`/api/movies${query ? `?${query}` : ''}`);
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },
  getMovieById: async (movieId) => {
    try {
      const response = await fetch(`/api/movies/${movieId}`);
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching movie:', error);
      throw error;
    }
  }
};
