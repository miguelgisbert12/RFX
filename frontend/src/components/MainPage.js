import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import ContentMain from './ContentMain';
import ContentAdd from './ContentAdd';
import ContentCollection from './ContentCollection';
import ConfirmationModal from './ConfirmationModal';
import { useMovies } from '../hooks/useMovies';

function MainPage() {
  const [activeSection, setActiveSection] = useState('main');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null); //new
  const { movies, recentMovies, loadMovies, loadRecentMovies, addMovie, updateMovie, deleteMovie } = useMovies();

  useEffect(() => {
    if (activeSection === 'main') {
      loadRecentMovies();
    } else if (activeSection === 'collection') {
      console.log('Cargando películas...');
      loadMovies();
    }
  }, [activeSection]);

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setActiveSection('add');
  };

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

  const handleLogout = () => {
    // Implementar lógica de cierre de sesión
    window.location.href = "/";
  };

  return (
    <div id="main_page">
      <Header />
      
      {activeSection === 'main' && <ContentMain recentMovies={recentMovies} setActiveSection={setActiveSection} />}
      {activeSection === 'add' && <ContentAdd addOrUpdateMovie={handleAddOrUpdateMovie} setActiveSection={setActiveSection} editingMovie={editingMovie} />}
      {activeSection === 'collection' && <ContentCollection movies={movies} deleteMovie={deleteMovie} editMovie={handleEditMovie} setActiveSection={setActiveSection} />}

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