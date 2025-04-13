import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoadingPage from './LoadingPage';
import LoginPage from './LoginPage';
import MainPage from './MainPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            setIsLoggedIn(true);
          } else {
            // Si el token no es válido, borra el localStorage y cambia isLoggedIn a false
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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('nombreUsuario');
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isLoggedIn ? 
            <Navigate to="/pagina-principal" replace /> : 
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          } 
        />
        <Route 
          path="/pagina-principal" 
          element={
            isLoggedIn ? 
            <MainPage onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
         <Route 
          path="/" 
          element={
            isLoggedIn ? 
            <Navigate to="/pagina-principal" replace /> : 
            <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;