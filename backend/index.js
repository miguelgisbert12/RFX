const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
const path = require('path');
require('dotenv').config();

// Instancia de Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas
app.use('/api', routes);

// Imágenes
app.use("/uploads", express.static("uploads"));

// Verificación del servidor
app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Conectar a MongoDB antes de iniciar el servidor
mongoose.connect('mongodb://localhost:27017/peliculasDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Conectado a MongoDB');

    const PORT = process.env.PORT || 5000; // Iniciar el servidor si hay buena conexión
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
})
