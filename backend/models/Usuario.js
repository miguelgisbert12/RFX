const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema para el modelo de Usuario en la base de datos
const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true, minlength: [2, 'El nombre debe tener al menos 2 caracteres'], maxlength: [50, 'El nombre no puede exceder los 50 caracteres'] },
    email: { type: String, required: true, unique: true, lowercase: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, ingrese un email válido'] },
    password: { type: String, required: true, minlength: [8, 'La contraseña debe tener al menos 8 caracteres']}
}, {timestamps: true});

// Middleware para encriptar la contraseña antes de guardar el usuario en la base de datos
usuarioSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// Método para comparar la contraseña introducida en el formulario con la contraseña real del usuario
usuarioSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;