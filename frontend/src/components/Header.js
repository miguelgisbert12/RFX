import React from 'react';
import userIcon from '../images/user.png';
import searchIcon from '../images/lupa.png';
import logoRfx from '../images/logo_rfx.png';

function Header() {
  return (
    <header>
      <div className="red_square thin fixed"></div>
      <div id="header_blue">
        <div id="foto_perfil">
          <img src={userIcon} alt="icono_usuario" />
        </div>
        <div id="buscador">
          <img src={searchIcon} alt="icono_lupa" />
          <p>Busca aquí</p>
        </div>
        <img id="logo_header" src={logoRfx} alt="logo_rateflix" />
      </div>
    </header>
  );
}

export default Header;