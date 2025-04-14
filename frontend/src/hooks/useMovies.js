import { useState } from 'react';


// Hook personalizado para manejar las películas
export function useMovies() {

  // Almacenar todas las películas y la lista de películas recientes
  const [movies, setMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);

  // Cargar todas las películas del usuario
  const loadMovies = async () => {
    const userId = localStorage.getItem('usuarioId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      console.error('No se encontró userId o token');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/peliculas/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMovies(data.peliculas);
    } catch (error) {
      console.error('Error al obtener las películas:', error);
    }
  };

  // Cargar las últimas 6 películas del usuario
  const loadRecentMovies = async () => {
    const userId = localStorage.getItem('usuarioId');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      console.error('No se encontró userId o token');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/peliculas/recientes/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRecentMovies(data);
    } catch (error) {
      console.error('Error al obtener las últimas películas:', error);
    }
  };

  // Añadir una película a la biblioteca del usuario
  const addMovie = async (movieData) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('usuarioId');

    if (!token || !userId) {
      console.error('No se encontró el token o el userId');
      return;
    }
    movieData.append('usuarioId', userId);
    console.log('Token:', token);
    console.log('Datos de la película a enviar:', Object.fromEntries(movieData));

    try {
      const response = await fetch('http://localhost:5000/api/peliculas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: movieData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      const data = await response.json();
      setMovies(prevMovies => [...prevMovies, data]);
      return data;
    } catch (error) {
      console.error('Error al añadir la película:', error);
      throw error;
    }
  };

  // Actualizar una película existente
  const updateMovie = async (id, movieData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/peliculas/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: movieData
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la película');
      }

      const updatedMovie = await response.json();
      setMovies(prevMovies => prevMovies.map(movie => movie._id === id ? updatedMovie : movie));
      return updatedMovie;

    } catch (error) {
      console.error('Error al actualizar la película:', error);
      throw error;
    }
  };

  // Eliminar una película existente
  const deleteMovie = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/peliculas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar la película');
      }

      setMovies(prevMovies => prevMovies.filter(movie => movie._id !== id));
    } catch (error) {
      console.error('Error al eliminar la película:', error);
    }
  };

  // Devuelve las funciones y estados para usarlos en otros componentes
  return { movies, recentMovies, loadMovies, loadRecentMovies, addMovie, updateMovie, deleteMovie };
}