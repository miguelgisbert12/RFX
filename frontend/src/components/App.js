import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoadingPage from './LoadingPage';
import LoginPage from './LoginPage';
import MainPage from './MainPage';

function App() {

  // Estados para manejar la carga de la página, la autenticación del usuario y la pantalla de carga inicial
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Solicitud al servidor para verificar el token
          const response = await fetch('http://localhost:5000/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            setIsLoggedIn(true); // Si el token es válido, cambia isLoggedIn a "true"
          } else {
            // Si el token no es válido, borra el localStorage y cambia isLoggedIn a "false"
            handleLogout();
          }
        } catch (error) {
          console.error('Error al verificar el token:', error);
          handleLogout();
        }
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Manejar el inicio de sesión exitoso
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('nombreUsuario');
    setIsLoggedIn(false);
    setIsInitialLoad(true);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Router>
      <Routes>
        {/* Ruta general */}
        <Route 
          path="/" 
          element={
            isInitialLoad ? (
              <LoadingPage onLoadingComplete={() => setIsInitialLoad(false)} />
            ) : (
              isLoggedIn ? 
              <Navigate to="/pagina-principal" replace /> : 
              <Navigate to="/login" replace />
            )
          } 
        />
        {/* Ruta del login (inicio de sesión) */}
        <Route 
          path="/login" 
          element={
            isLoggedIn ? 
            <Navigate to="/pagina-principal" replace /> : 
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          } 
        />
        {/* Ruta de la página principal */}
        <Route 
          path="/pagina-principal" 
          element={
            isLoggedIn ? 
            <MainPage onLogout={handleLogout} /> : 
            <Navigate to="/" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;