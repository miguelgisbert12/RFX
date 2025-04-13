const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Conectado a MongoDB');
  const usuarios = await Usuario.find({}, 'nombre email');
  console.log('Usuarios en la base de datos:');
  console.log(usuarios);
  mongoose.connection.close();
})
.catch(error => console.error('Error:', error.message));