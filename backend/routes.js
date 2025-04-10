const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const Pelicula = require('./models/Pelicula');
const Usuario = require('./models/Usuario');

// Configurar almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({storage});

// Ruta para obtener todas las películas guardadas
router.get('/peliculas/:usuarioId', async(req, res) => {

    const { usuarioId } = req.params;

    if(!usuarioId) {
        return res.status(400).json({ error: "El usuarioId es obligatorio" });
    }

    try { // Buscar todas las películas del usuario
        const peliculas = await Pelicula.find({ usuarioId: usuarioId });
        res.status(200).json(peliculas); // Enviar todas las películas del usuario en formato json

    }catch(error) {
        res.status(500).json({ error: "Error al obtener las películas" });
    }
});

// Ruta para obtener las 6 películas más recientes (añadidas por el usuario)
router.get('/peliculas/recientes/:usuarioId', async(req, res) => {
    try {
        const { usuarioId } = req.params;
        const peliculasRecientes = await Pelicula.find({ usuarioId }).sort({ _id: -1 }).limit(6);
        res.json(peliculasRecientes);

    }catch(error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta para obtener una película por su Id
router.get('/peliculas/:usuarioId/:id', async (req, res) => {
    const { usuarioId, id } = req.params; // Obtener la ID del usuario y de la URL

    try {
        // Buscar la película por su ID en la base de datos
        const pelicula = await Pelicula.findOne({ _id: id, usuarioId: usuarioId });

        if (!pelicula) {
            return res.status(404).json({ error: "Película no encontrada" });
        }

        res.status(200).json(pelicula); // Enviar la película encontrada

    } catch (error) {
        console.error("Error al obtener la película:", error);
        res.status(500).json({ error: "Error al obtener la película" });
    }
});

// Ruta para verificar el inicio de sesión con correo electrónico y contraseña

router.post('/login', async(req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        console.log("Usuario encontrado:", usuario);

        if(!usuario || usuario.password !== password) {
            return res.json({ success: false, message: "Credenciales incorrectas" });
        }

        res.json({ success: true, usuarioId: usuario._id, nombre: usuario.nombre });

    }catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});

// Ruta para añadir una nueva película con imagen

router.post('/peliculas', upload.single("imagen"), async(req, res) => {
    const {nombre, year, genero, nacionalidad, direccion, valoracion, usuario} = req.body;

    if(!usuario) {
        return res.status(400).json({ error: "El usuario es obligatorio" });
    }

    const imagen = req.file ? req.file.filename : null;

    try {
        const nuevaPelicula = new Pelicula({nombre, year, genero, nacionalidad, direccion, valoracion, imagen, usuarioId: usuario});
        await nuevaPelicula.save();
        res.status(201).json(nuevaPelicula);

    }catch(error) {
        console.error("Error al crear la película", error);
        res.status(500).json({error: error.message});
    }
})

// Ruta para editar una película
router.put('/peliculas/:id', upload.single('imagen'), async (req, res) => {

    try {

        const pelicula = await Pelicula.findById(req.params.id);

        if(!pelicula) {
            return res.status(404).json({ error: "Película no encontrada" });
        }

        const nuevaImagen = req.file ? req.file.filename : pelicula.imagen;

        pelicula.nombre = req.body.nombre || pelicula.nombre;
        pelicula.year = req.body.year || pelicula.year;
        pelicula.genero = req.body.genero || pelicula.genero;
        pelicula.nacionalidad = req.body.nacionalidad || pelicula.nacionalidad;
        pelicula.direccion = req.body.direccion || pelicula.direccion;
        pelicula.valoracion = req.body.valoracion || pelicula.valoracion;
        pelicula.imagen = nuevaImagen;

        await pelicula.save();
        res.json({ mensaje: "Película actualizada correctamente", pelicula });

    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la película" });
    }
});


// Ruta para eliminar una película
router.delete('/peliculas/:id', async (req, res) => {

    try {
        const pelicula = await Pelicula.findByIdAndDelete(req.params.id);

        if(!pelicula) {
            return res.status(404).json({ error: "Película no encontrada" });
        }

        if(pelicula.imagen) {
            fs.unlinkSync(`./uploads/${pelicula.imagen}`);
        }

        res.json({ mensaje: "Película eliminada correctamente" });

    } catch(error) {
        res.status(500).json({error: "Error interno del servidor"});
    }
});

module.exports = router;