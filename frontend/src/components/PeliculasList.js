import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PeliculasList = () => {
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    const fetchPeliculas = async () => {
      const res = await axios.get('http://localhost:5000/api/peliculas');
      setPeliculas(res.data);
    };
    fetchPeliculas();
  }, []);

  return (
    <div>
      <h2>Lista de Películas</h2>
      {peliculas.map(pelicula => (
        <div key={pelicula._id}>
          <h3>{pelicula.nombre}</h3>
          <p>Año: {pelicula.year}</p>
          <p>Género: {pelicula.genero}</p>
          {/* Añade más detalles según necesites */}
        </div>
      ))}
    </div>
  );
};

export default PeliculasList;