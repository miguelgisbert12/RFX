const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Imágenes
app.use('/uploads', express.static('uploads'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(error => console.error('Error al conectar a MongoDB:', error.message));

// Rutas
const peliculasRoutes = require('./routes/peliculas');
const authRoutes = require('./routes/auth');

app.use('/api/peliculas', peliculasRoutes);
app.use('/api/auth', authRoutes);

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(500).send('Error en el servidor');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
