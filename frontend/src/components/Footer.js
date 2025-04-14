import React from 'react';
import homeIcon from '../images/home.png';
import addIcon from '../images/add.png';
import collectionIcon from '../images/coleccion.png';
import logoutIcon from '../images/cerrar_sesion.png';

// Componente para el footer de la app
// Contiene un menú de opciones para navegar en la app y un botón para cerrar sesión
// Se utilizó IA como soporte para simular la interacción del usuario con el menú inferior, generando eventos de click en los botones y cambiando la sección activa según el botón pulsado
function Footer({ activeSection, setActiveSection, setShowConfirmation }) {

  // Determinar la posición de la barra del menú según la sección activa
  const getBarPosition = () => {
    switch(activeSection) {
      case 'main':
        return '4%';
      case 'add':
        return '30%';
      case 'collection':
        return '55%';
      default:
        return '4%';
    }
  };

  return (
    <footer>
      <div id="decoration_bar"></div>

      {/* Barra móvil de del menú inferior */}
      <div id="select_bar">
        <div id="moving_bar" style={{ marginLeft: getBarPosition() }}></div>
      </div>

      {/* Menú inferior */}
      <div id="footer_blue">
        {/* Ir a Inicio */}
        <div id="icono_inicio" className="menu_inferior" onClick={() => setActiveSection('main')}>
          <img src={homeIcon} alt="icono_inicio" />
          <p id="txt_inicio" className={`icon_txt negrita ${activeSection !== 'main' ? 'off' : ''}`}>Inicio</p>
        </div>
        {/* Ir a Añadir película */}
        <div id="icono_add" className="menu_inferior" onClick={() => setActiveSection('add')}>
          <img src={addIcon} alt="icono_add" />
          <p className={`icon_txt negrita ${activeSection !== 'add' ? 'off' : ''}`}>Añadir</p>
        </div>
        {/* Ir a Tu Colección */}
        <div id="icono_coleccion" className="menu_inferior" onClick={() => setActiveSection('collection')}>
          <img src={collectionIcon} alt="icono_coleccion" />
          <p id="txt_coleccion" className={`icon_txt negrita ${activeSection !== 'collection' ? 'off' : ''}`}>Colección</p>
        </div>
        {/* Cerrar Sesión */}
        <div id="icono_cerrar_sesion" className="menu_inferior" onClick={() => setShowConfirmation(true)}>
          <img src={logoutIcon} alt="cerrar_sesion" />
        </div>
      </div>
      <div className="red_square thin fixed"></div>
    </footer>
  );
}

export default Footer;