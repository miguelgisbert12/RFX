import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import ContentMain from './ContentMain';
import ContentAdd from './ContentAdd';
import ContentCollection from './ContentCollection';
import ConfirmationModal from './ConfirmationModal';
import { useMovies } from '../hooks/useMovies';

// Componente MainPage que funciona como contenedor principal de la app
function MainPage() {

  // Manejar la sección activa, la confirmación de cierre de sesión y la película en edición
  const [activeSection, setActiveSection] = useState('main');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [barPosition, setBarPosition] = useState('4%');

  // Obtener datos del hook de películas
  const { movies, recentMovies, loadMovies, loadRecentMovies, addMovie, updateMovie, deleteMovie } = useMovies();

  useEffect(() => {
    if (activeSection === 'main') {
      loadRecentMovies();
    } else if (activeSection === 'collection') {
      console.log('Cargando películas...');
      loadMovies();
    }
  }, [activeSection]);

  // Manejar la edición de películas
  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setActiveSection('add');
  };

  // Manejar la inclusión o la actualización de películas
  const handleAddOrUpdateMovie = async (movieData) => {
    if (editingMovie) {
      await updateMovie(editingMovie._id, movieData);
    } else {
      await addMovie(movieData);
    }
    setEditingMovie(null);
    loadMovies();
    setActiveSection('collection');
  };

  // Manejar el cierre de sesión
  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div id="main_page">
      <Header />
      
      {/* Cambio entre componentes según la sección activa */}
      {activeSection === 'main' && <ContentMain recentMovies={recentMovies} setActiveSection={setActiveSection} />}
      {activeSection === 'add' && <ContentAdd addOrUpdateMovie={handleAddOrUpdateMovie} setActiveSection={setActiveSection} editingMovie={editingMovie} />}
      {activeSection === 'collection' && <ContentCollection movies={movies} deleteMovie={deleteMovie} editMovie={handleEditMovie} setActiveSection={setActiveSection} />}

      {/* Confirmar el cierre de sesión */}
      {showConfirmation && (
        <ConfirmationModal 
          onConfirm={handleLogout} 
          onCancel={() => setShowConfirmation(false)} 
        />
      )}

      <Footer 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        setShowConfirmation={setShowConfirmation}
      />
    </div>
  );
}

export default MainPage;