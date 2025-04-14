import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import logoSmall from '../images/logo_rfx.png';
import logoWords from '../images/words_rfx.png';

// Componente LoginPage para manejar el inicio de sesión de los usuarios
function LoginPage({ onLoginSuccess }) {
  // Manejar el email, la contraseña y el error de inicio de sesión
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // URL de la API
  const API_URL =  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Limpiar formulario al iniciar la app o al cerrar sesión
  useEffect(() => {
    setEmail('');;
    setPassword('');
  }, []);

  // Envío del formulario de inicio de sesión
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    console.log('Intentando inicio de sesión con:', { email, password });

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log("Respuesta del servidor:", response.status);
      const data = await response.json();
      console.log("Datos de respuesta:", data);

      if (response.ok) {
        if (data.token && data.usuario) {
          // Guardar el token y los datos del usuario en el local storage
          localStorage.setItem('token', data.token);
          localStorage.setItem('usuarioId', data.usuario.id);
          localStorage.setItem('nombreUsuario', data.usuario.nombre);
          onLoginSuccess();
          navigate('/pagina-principal');
        } else {
          setErrorMessage("Respuesta del servidor incompleta");
        }
      } else {
        setErrorMessage(data.message || "Error en la autenticación");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrorMessage("Hubo un problema con el servidor");
    }
  };

  return (
    <div id="login_page">
      <div className="red_square"></div>
      <div id="content_login">
        <div id="logos_login">
          <img id="logo_small" src={logoSmall} alt="rateflix_logo" />
          <img id="logo_words" src={logoWords} alt="rateflix_words" />
        </div>
        {/* Formulario de inicio de sesión */}
        <section id="formulario_login">
          <h3>INICIO DE SESIÓN</h3>
          <form onSubmit={handleSubmit}>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico*" 
              required
              autoComplete= "new-email" 
            />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña*" 
              required 
              autoComplete="new-password"
            />
            <button type="submit">ENTRAR</button>
          </form>
          {/* Mensaje de error si no se consigue iniciar sesión */}
          {errorMessage && <p id="error_message" className="error">{errorMessage}</p>}
        </section>
      </div>
      <div className="red_square bottom_bar"></div>
    </div>
  );
}

export default LoginPage;