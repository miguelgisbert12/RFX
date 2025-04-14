import React, { useState, useEffect } from 'react';

function ContentAdd({ addOrUpdateMovie, setActiveSection, editingMovie }) {
  const [formData, setFormData] = useState({
    nombre: '',
    year: '',
    genero: '',
    nacionalidad: '',
    direccion: '',
    valoracion: '5',
    imagen: null
  });

  useEffect(() => {
    if (editingMovie) {
      setFormData({
        nombre: editingMovie.nombre || '',
        year: editingMovie.year || '',
        genero: editingMovie.genero || '',
        nacionalidad: editingMovie.nacionalidad || '',
        direccion: editingMovie.direccion || '',
        valoracion: editingMovie.valoracion || '',
        imagen: null
      });
    }
  }, [editingMovie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const movieData = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        movieData.append(key, formData[key]);
      }
    }
    await addOrUpdateMovie(movieData);
    setActiveSection('collection');
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <section id="content_add">
      <h3 id="titulo_add" className="red">{editingMovie ? 'Editar' : 'Añadir'} película</h3>
      <p id="txt_vamos" className="negrita">¡Vamos a {editingMovie ? 'actualizar' : 'guardar'} en tu biblioteca!</p>

      <form id="formulario_pelicula" onSubmit={handleSubmit}>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
        <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Año" required />
        <input type="text" name="genero" value={formData.genero} onChange={handleChange} placeholder="Género" required />
        <input type="text" name="nacionalidad" value={formData.nacionalidad} onChange={handleChange} placeholder="País" required />
        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Director/a" required />
        <div className="valoracion-container">
          <label htmlFor="valoracion">Valoración: {formData.valoracion}</label>
          <input 
            type="range" 
            id="valoracion"
            name="valoracion" 
            min="1" 
            max="10" 
            value={formData.valoracion} 
            onChange={handleChange} 
            required 
          />
        </div>
        <input id='image_file' type="file" name="imagen" onChange={handleChange} accept="image/*" required={!editingMovie} />

        <button id="btn_guardar" type="submit">{editingMovie ? 'ACTUALIZAR' : 'GUARDAR'}</button>
      </form>

      <div className="blank_space"></div>
    </section>
  );
}

export default ContentAdd;