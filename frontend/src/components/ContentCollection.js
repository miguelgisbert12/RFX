import React from 'react';
import logoRfx from '../images/logo_rfx.png';
import triangleIcon from '../images/triangle.png';

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

      {hasMovies && (
        <ul id="mi_coleccion">
          {movies.map(movie => (
            <li key={movie._id} onClick={() => editMovie(movie)} className="pelicula_guardada">
              <img id="portada" src={`http://localhost:5000/uploads/${movie.imagen}`} alt="portada" />
              <section className="info_pelicula_guardada">
                <div className="flex_box">
                  <p className="titulo_pelicula_guardada">{movie.nombre} ({movie.year})</p>
                  <div className="box_nota">
                    <h2 className="red">{movie.valoracion}</h2>
                  </div>
                </div>
                <hr className="separador_info" />
                <p className="year_pelicula_guardada white thin"><span className="red">Año de lanzamiento: </span>{movie.year}</p>
                <p className="genero_pelicula_guardada white thin"><span className="red">Género: </span>{movie.genero}</p>
                <p className="pais_pelicula_guardada white thin"><span className="red">País: </span>{movie.nacionalidad}</p>
                <p className="direccion_pelicula_guardada white thin"><span className="red">Dirección: </span>{movie.direccion}</p>
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

      {hasMovies && <div id="blank_space_coleccion" className="blank_space"></div>}
    </section>
  );
}

export default ContentCollection;