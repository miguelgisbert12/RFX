const mongoose = require('mongoose');

const peliculaSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true, minlength: 1, maxlength: 100},
    year: { type: Number, required: true, min: 1888, max: new Date().getFullYear() },
    genero: { type: String, required: true, trim: true, minlength: 1, maxlength: 50 },
    nacionalidad: { type: String, required: true, trim: true, minlength: 1, maxlength: 50 },
    direccion: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
    valoracion: { type: Number, required: true, min: 1, max: 10 },
    imagen: { type: String, trim: true, default: '' },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

const Pelicula = mongoose.model('Pelicula', peliculaSchema);

module.exports = Pelicula;