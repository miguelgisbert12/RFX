const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const Pelicula = require('../models/Pelicula');
const auth = require('../middleware/auth');
const path = require('path');

// Configurar almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({storage});

// Obtener todas las películas (con paginación)
router.get('/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Verifica que el usuario autenticado solo pueda ver sus propias películas
        if (req.usuario.id !== userId) {
            return res.status(403).json({ message: 'No autorizado para ver estas películas' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        const total = await Pelicula.countDocuments({ usuarioId: userId });
        const peliculas = await Pelicula.find({ usuarioId: userId })
                                        .sort({ createdAt: -1 })
                                        .limit(limit)
                                        .skip(startIndex);

        res.json({
            peliculas,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });
    } catch (error) {
        console.error('Error al obtener las películas:', error);
        res.status(500).json({ message: 'Error al obtener las películas', error: error.message });
    }
});

// Crear una nueva película
router.post('/', auth, upload.single('imagen'), async (req, res) => {
  console.log('Cuerpo de la solicitud:', req.body);
  console.log('Usuario ID recibido:', req.body.usuarioId);
  console.log('Usuario ID del token:', req.usuario._id);
  console.log('Archivo recibido:', req.file);

    try {
      const { nombre, year, genero, nacionalidad, direccion, valoracion } = req.body;
      const usuarioId = req.usuario.id;

      console.log('Datos extraídos:', { nombre, year, genero, nacionalidad, direccion, valoracion });
      
      if (!nombre || !year || !genero || !nacionalidad || !direccion || !valoracion) {
        console.log('Campos faltantes:', { nombre, year, genero, nacionalidad, direccion, valoracion });
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }
  
      const pelicula = new Pelicula({
        nombre,
        year,
        genero,
        nacionalidad,
        direccion,
        valoracion,
        usuarioId: usuarioId,
        imagen: req.file ? req.file.filename : null
      });

      console.log('Película a guardar:', pelicula);

      const nuevaPelicula = await pelicula.save();
      res.status(201).json(nuevaPelicula);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear la película', error: error.message });
    }
  });

// Actualizar una película
router.put('/:id', auth, upload.single('imagen'), async (req, res) => {
    try {
      const pelicula = await Pelicula.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!pelicula) {
        return res.status(404).json({ message: 'Película no encontrada' });
      }

      if (req.file) {
        if (pelicula.imagen) {
            fs.unlinkSync(`./uploads/${pelicula.imagen}`);
        }
        pelicula.imagen = req.file.filename;
    }

    Object.assign(pelicula, req.body);
    await pelicula.save();
    res.json(pelicula);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar la película', error: error.message });
    }
});
  
// Eliminar una película
router.delete('/:id', auth, async (req, res) => {

try {
    const pelicula = await Pelicula.findByIdAndDelete({ _id: req.params.id, usuarioId: req.usuario.id });
    if (!pelicula) {
        return res.status(404).json({ message: 'Película no encontrada' });
    }
    
    // Si la película tiene una imagen, elimínala
    if (pelicula.imagen) {
      const imagePath = path.join(__dirname, '..', 'uploads', pelicula.imagen);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error al eliminar la imagen:', err);
        }
      });
    }
    
    res.json({ message: 'Película eliminada correctamente' });
} catch (error) {
    res.status(500).json({ message: 'Error al eliminar la película', error: error.message });
}

});

// Mostrar películas recientes del usuario
router.get('/recientes/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verifica que el usuario autenticado solo pueda ver sus propias películas
    if (req.usuario.id !== userId) {
      return res.status(403).json({ message: 'No autorizado para ver estas películas' });
    }

    const peliculas = await Pelicula.find({ usuarioId: userId })
      .sort({ createdAt: -1 })
      .limit(6); // Obtiene las 6 películas más recientes
    res.json(peliculas);
  } catch (error) {
    console.error('Error al obtener películas recientes:', error);
    res.status(500).json({ message: 'Error del servidor al obtener películas recientes' });
  }
});

module.exports = router;