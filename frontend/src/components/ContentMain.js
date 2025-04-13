import React from 'react';
import logoRfx from '../images/logo_rfx.png';
import logoRfxEmpty from '../images/logo_rfx_empty.png';

function ContentMain({ recentMovies, setActiveSection }) {
  const userName = localStorage.getItem("nombreUsuario") || "Usuario";
  const hasMovies = recentMovies.length > 0;

  return (
    <section id="content_main">
      <h2 id="saludo_inicio" className="red">Hola de nuevo, {userName}</h2>
      <p id="txt_ultimas" className="negrita">Tus últimas valoraciones</p>

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

      {hasMovies && (
        <ul id="ultimas_valoraciones">
          {recentMovies.map(movie => (
            <li key={movie._id} className="pelicula">
              <div className="film_img" style={{backgroundImage: `url('http://localhost:5000/uploads/${movie.imagen}')`}}>
                <img src={logoRfxEmpty} alt="logo_empty" />
                <h2 className="red">{movie.valoracion}</h2>
              </div>
              <p className="film_title">{movie.nombre} ({movie.year})</p>
            </li>
          ))}
        </ul>
      )}

      {hasMovies && <div id="blank_space_inicio" className="blank_space"></div>}
    </section>
  );
}

export default ContentMain;