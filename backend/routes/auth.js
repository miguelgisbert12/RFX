const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    console.log('Received login request:', req.body);
    
    try {
        const { email, password } = req.body;

        // Validar que se haya introducido un email y una contraseña (obligatorios)
        if (!email ||!password) {
            return res.status(400).json({ message: 'Debes proporcionar un email y contraseña' });
        }

        // Buscar el usuario en la base de datos
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Verificar la contraseña introducida
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Crear y enviar el token JWT (con una duración de 1 hora): el usuario podrá acceder a los datos de la API
        const payload = {
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error('Error al generar el token:', err);
                    return res.status(500).json({ message: 'Error al generar el token' });
                }
                res.json({ 
                    token,
                    usuario: {
                        id: usuario.id,
                        nombre: usuario.nombre,
                        email: usuario.email
                    }
                });
            }
        );

    }catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});


// Ruta para verificar el token JWT
router.get('/verify', (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, autorización denegada' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ userId: decoded.usuario.id, nombre: decoded.usuario.nombre });
    } catch (err) {
      res.status(400).json({ msg: 'Token no válido' });
    }
});

module.exports = router;