// (Archivo para obtener todos los usuarios registrados en la base de datos y comprobar que existan)

const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');
require('dotenv').config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Conectado a MongoDB');

  // Buscar y mostrar todos los usuarios registrados en la base de datos
  const usuarios = await Usuario.find({}, 'nombre email');
  console.log('Usuarios en la base de datos:');
  console.log(usuarios);

  // Cerrar la conexión con MongoDB
  mongoose.connection.close();
})
.catch(error => console.error('Error:', error.message));