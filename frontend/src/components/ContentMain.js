import React from 'react';
import logoRfx from '../images/logo_rfx.png';
import logoRfxEmpty from '../images/logo_rfx_empty.png';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Componente para el contenido de la página principal con las últimas valoraciones
function ContentMain({ recentMovies, setActiveSection }) {
  const userName = localStorage.getItem("nombreUsuario") || "Usuario";

  // Verificar si hay películas en la biblioteca
  const hasMovies = recentMovies.length > 0;

  return (
    <section id="content_main">
      <h2 id="saludo_inicio" className="red">Hola de nuevo, {userName}</h2>
      <p id="txt_ultimas" className="negrita">Tus últimas valoraciones</p>

      {/* Esta sección aparece cuando la colección está vacía */}
      {/* Ofrece al usuario la posibilidad de añadir nuevas películas mediante un link directo */}
      <section id="aviso_lista_vacia" className={`lista_vacia ${!hasMovies ? 'show' : ''}`}>
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

      {/* Lista con las 6 últimas películas valoradas por el usuario */}  
      {hasMovies && (
        <ul id="ultimas_valoraciones">
          {recentMovies.map(movie => (
            <li key={movie._id} className="pelicula">
              <div className="film_img" style={{backgroundImage: `url('${API_URL}/uploads/${movie.imagen}')`}}>
                <img src={logoRfxEmpty} alt="logo_empty" />
                <h2 className="red">{movie.valoracion}</h2>
              </div>
              <p className="film_title">{movie.nombre} ({movie.year})</p>
            </li>
          ))}
        </ul>
      )}

      {/* Espacio en blanco al final de la colección para mejorar el scroll */}
      {hasMovies && <div id="blank_space_inicio" className="blank_space"></div>}
    </section>
  );
}

export default ContentMain;