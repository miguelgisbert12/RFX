const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Permitir la carga de archivos estáticos (imágenes)
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', (req, res, next) => {
  console.log('Solicitud de imagen:', req.url);
  next();
}, express.static(uploadsPath));

app.get('/', (req, res) => {
  res.send('El backend de Rateflix está funcionando');
});

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

// Verificar la carpeta 'uploads' y crearla si no existe
const fs = require('fs');
if (!fs.existsSync(uploadsPath)) {
  console.warn(`La carpeta 'uploads' no existe en ${uploadsPath}. Creándola...`);
  fs.mkdirSync(uploadsPath);
}

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
