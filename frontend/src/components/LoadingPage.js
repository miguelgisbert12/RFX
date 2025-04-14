import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import textLogo from '../images/words_rfx.png';
import logo from '../images/logo_rfx.png';

function LoadingPage() {
    const [messageIndex, setMessageIndex] = useState(0);
    const [activeDot, setActiveDot] = useState(-1);
    const navigate = useNavigate();
  
    const messages = [
      "Cargando usuarios...",
      "Pintando portadas...",
      "Buscando películas...",
      "Escribiendo reseñas..."
    ];
  
    useEffect(() => {
      const dotInterval = setInterval(() => {
        setActiveDot((prevDot) => (prevDot >= 3 ? 0 : prevDot + 1));
      }, 500);
  
      const messageInterval = setInterval(() => {
        setMessageIndex((prevIndex) => (prevIndex >= 3 ? 3 : prevIndex + 1));
      }, 1000);

      // Redirigir a login después de 5 segundos de carga
      const loadingTimer = setTimeout(() => {
        navigate('/login');
      }, 5000);
      
  
      return () => {
        clearInterval(dotInterval);
        clearInterval(messageInterval);
      };
    }, []);
  
    return (
      <div id="loading_page">
        <div className="red_square"></div>
        <div id="content">
          <img id="text_logo" src={textLogo} alt="rateflix_logo_text" />
          <img id="logo" src={logo} alt="rateflix_logo" />
          <div id="box_dots">
            {[0, 1, 2, 3].map((index) => (
              <div 
                key={index} 
                className="dot" 
                style={{ marginTop: activeDot === index ? '-5px' : '0px' }}
              ></div>
            ))}
          </div>
          <p id="message_loading">{messages[messageIndex]}</p>
        </div>
        <div className="red_square bottom_bar"></div>
      </div>
    );
  }
  
  export default LoadingPage;