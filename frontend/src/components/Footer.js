import React from 'react';
import homeIcon from '../images/home.png';
import addIcon from '../images/add.png';
import collectionIcon from '../images/coleccion.png';
import logoutIcon from '../images/cerrar_sesion.png';

function Footer({ activeSection, setActiveSection, setShowConfirmation }) {
  return (
    <footer>
      <div id="decoration_bar"></div>
      <div id="select_bar">
        <div id="moving_bar"></div>
      </div>
      <div id="footer_blue">
        <div id="icono_inicio" className="menu_inferior" onClick={() => setActiveSection('main')}>
          <img src={homeIcon} alt="icono_inicio" />
          <p id="txt_inicio" className={`icon_txt negrita ${activeSection !== 'main' ? 'off' : ''}`}>Inicio</p>
        </div>
        <div id="icono_add" className="menu_inferior" onClick={() => setActiveSection('add')}>
          <img src={addIcon} alt="icono_add" />
          <p className={`icon_txt negrita ${activeSection !== 'add' ? 'off' : ''}`}>Añadir</p>
        </div>
        <div id="icono_coleccion" className="menu_inferior" onClick={() => setActiveSection('collection')}>
          <img src={collectionIcon} alt="icono_coleccion" />
          <p id="txt_coleccion" className={`icon_txt negrita ${activeSection !== 'collection' ? 'off' : ''}`}>Colección</p>
        </div>
        <div id="icono_cerrar_sesion" className="menu_inferior" onClick={() => setShowConfirmation(true)}>
          <img src={logoutIcon} alt="cerrar_sesion" />
        </div>
      </div>
      <div className="red_square thin fixed"></div>
    </footer>
  );
}

export default Footer;