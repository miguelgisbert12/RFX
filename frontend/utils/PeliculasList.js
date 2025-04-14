import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Componente PeliculasList para mostrar la lista de películas
const PeliculasList = () => {
  // Almacenar la lista de películas
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    const fetchPeliculas = async () => {
      // Obtener todas las películas del usuario
      const res = await axios.get('http://localhost:5000/api/peliculas');
      setPeliculas(res.data);
    };
    fetchPeliculas();
  }, []);

  return (
    <div>
      <h2>Lista de Películas</h2>
      {/* Mostrar una a una cada película */}
      {peliculas.map(pelicula => (
        <div key={pelicula._id}>
          <h3>{pelicula.nombre}</h3>
          <p>Año: {pelicula.year}</p>
          <p>Género: {pelicula.genero}</p>
        </div>
      ))}
    </div>
  );
};

export default PeliculasList;