// Ejecutar este script para crear los 3 usuarios en la base de datos
const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const usuarios = [
    { nombre: "Federico", email: "federicogarcia01@gmail.com", password: "111111" },
    { nombre: "Rosa", email: "rosagutierrez02@gmail.com", password: "222222" },
    { nombre: "Álvaro", email: "alvaromartinez03@gmail.com", password: "333333" }
];

const resetearYCrearUsuarios = async () => {
    try {
        // Borrar todos los usuarios existentes
        await Usuario.deleteMany({});
        console.log("Usuarios existentes eliminados");

        // Crear nuevos usuarios
        for (let usuario of usuarios) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
        await Usuario.insertMany(usuarios);
        console.log("Nuevos usuarios creados exitosamente");

        // Verificar los usuarios creados
        const usuariosCreados = await Usuario.find({}, 'nombre email');
        console.log("Usuarios en la base de datos:", usuariosCreados);

    } catch (error) {
        console.error("Error al resetear y crear usuarios:", error);
    } finally {
        mongoose.connection.close();
    }
};

resetearYCrearUsuarios();