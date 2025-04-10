// Ejecutar este script para crear los 3 usuarios en la base de datos

const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');

mongoose.connect('mongodb://localhost:27017/peliculasDB', { useNewUrlParser: true, useUnifiedTopology: true });

const usuarios = [
    { nombre: "Federico", email: "federicogarcia01@gmail.com", password: "111111" },
    { nombre: "Rosa", email: "rosagutierrez02@gmail.com", password: "222222" },
    { nombre: "Álvaro", email: "alvaromartinez03@gmail.com", password: "333333" }
];

Usuario.insertMany(usuarios)
    .then(() => {
        console.log("Usuarios creados exitosamente");
        mongoose.connection.close();
    })
    .catch(error => console.error("Error al crear usuarios:", error));