import React from 'react';
import logoRfx from '../images/logo_rfx.png';
import triangleIcon from '../images/triangle.png';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Componente para mostrar la lista de películas en la biblioteca del usuario
function ContentCollection({ movies, deleteMovie, editMovie, setActiveSection }) {
  const hasMovies = movies.length > 0;

  return (
    <section id="content_collection">
      <section className="flex_box">
        <h3 id="titulo_biblioteca" className="red">Tu colección</h3>
        <p id="num_peliculas">{movies.length} película{movies.length !== 1 ? 's' : ''}</p>
      </section>

      <p id="txt_magnifica" className="negrita">
        {hasMovies ? "Una colección magnífica, ¡sigue así!" : "Aquí aparecerán las películas que vayas guardando y valorando"}
      </p>

      {/* Esta sección aparece cuando la colección está vacía */}
      {/* Ofrece al usuario la posibilidad de añadir nuevas películas mediante un link directo */}
      {!hasMovies && (
        <section id="aviso_lista_vacia" className="lista_vacia show">
          <img src={logoRfx} alt="logo_rfx" />
          <section id="textos_avisos">
            <div id="banner_aviso" className="avisos_lista_vacia">
              <p>Oh, al parecer tu biblioteca está vacía.</p>
              <p>¡Empieza por añadir películas a la lista!</p>
            </div>
            <div id="btn_vamos" className="btns_redirect_add" onClick={() => setActiveSection('add')}>
              <h3>Ir a <span className="underlined">Añadir Película</span></h3>
            </div>
          </section>
        </section>
      )}

      {/* Lista de películas del usuario */}
      {hasMovies && (
        <ul id="mi_coleccion">
          {movies.map(movie => (
            <li key={movie._id} onClick={() => editMovie(movie)} className="pelicula_guardada">

              {/* Imagen de la película (portada) */}
              <img id="portada" src={`${API_URL.replace('/api', '')}/uploads/${movie.imagen}`} alt="portada" />
              <section className="info_pelicula_guardada">
                {/* Título y valoración */}
                <div className="flex_box">
                  <p className="titulo_pelicula_guardada">{movie.nombre} ({movie.year})</p>
                  <div className="box_nota">
                    <h2 className="red">{movie.valoracion}</h2>
                  </div>
                </div>
                <hr className="separador_info" />
                {/* Detalles de la película (año de lanzamiento, género, país y dirección) */}
                <p className="year_pelicula_guardada white thin"><span className="red">Año de lanzamiento: </span>{movie.year}</p>
                <p className="genero_pelicula_guardada white thin"><span className="red">Género: </span>{movie.genero}</p>
                <p className="pais_pelicula_guardada white thin"><span className="red">País: </span>{movie.nacionalidad}</p>
                <p className="direccion_pelicula_guardada white thin"><span className="red">Dirección: </span>{movie.direccion}</p>
                {/* Botón para eliminar la película de la colección */}
                <img 
                  src={triangleIcon} 
                  alt="Eliminar" 
                  className="delete_btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(window.confirm(`¿Deseas eliminar la película "${movie.nombre}" de tu colección?`)) {
                      deleteMovie(movie._id);
                    }
                  }}
                />
              </section>
            </li>
          ))}
        </ul>
      )}

      {/* Espacio en blanco al final de la colección para mejorar el scroll */}
      {hasMovies && <div id="blank_space_coleccion" className="blank_space"></div>}
    </section>
  );
}

export default ContentCollection;