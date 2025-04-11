const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const Pelicula = require('../models/Pelicula');
const auth = require('../middlewares/auth');

// Configurar almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({storage});

// Obtener todas las películas (con paginación)
router.get('/', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;
  
      const total = await Pelicula.countDocuments();
      const peliculas = await Pelicula.find().limit(limit).skip(startIndex);
  
      res.json({
        peliculas,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las películas', error: error.message });
    }
});

// Crear una nueva película
router.post('/', auth, upload.single('imagen'), async (req, res) => {
    try {
      const { nombre, year, genero, nacionalidad, direccion, valoracion } = req.body;
      
      if (!nombre || !year || !genero || !nacionalidad || !direccion || !valoracion) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }
  
      const pelicula = new Pelicula({
        ...req.body,
        usuarioId: req.usuario._id,
        imagen: req.file? req.file.filename : null
      });

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
    if(pelicula.imagen) {
        fs.unlinkSync(`./uploads/${pelicula.imagen}`);
    }
    res.json({ message: 'Película eliminada correctamente' });
} catch (error) {
    res.status(500).json({ message: 'Error al eliminar la película', error: error.message });
}

});

// Mostrar películas recientes
router.get('/recientes', auth, async (req, res) => {
    try {
        const peliculasRecientes = await Pelicula.find({ usuarioId: req.usuario.id })
            .sort({ _id: -1 })
            .limit(6);
        res.json(peliculasRecientes);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;