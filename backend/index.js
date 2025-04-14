const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(error => console.error('Error al conectar a MongoDB:', error.message));

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
