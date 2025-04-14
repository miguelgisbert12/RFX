const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Permitir la carga de archivos estáticos (imágenes)
app.use('/uploads', express.static('uploads'));

// Conexión con MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado a MongoDB');
  
  // Determinar si es una conexión local o a Atlas
  const isAtlas = process.env.MONGODB_URI.includes('mongodb+srv');
  const connectionType = isAtlas ? 'MongoDB Atlas' : 'MongoDB Local';
  
  console.log(`Tipo de conexión: ${connectionType}`);
})
.catch(error => {
  console.error('Error al conectar a MongoDB:', error.message);
  console.error('Tipo de error:', error.name);
});

mongoose.connection.on('error', err => {
  console.error('Error de conexión de MongoDB:', err);
});

// Importar rutas
const peliculasRoutes = require('./routes/peliculas');
const authRoutes = require('./routes/auth');

app.use('/api/peliculas', peliculasRoutes);
app.use('/api/auth', authRoutes);

// Middleware para el manejo de errores global
app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(500).send('Error en el servidor');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
