const Usuario = require('./models/Usuario');

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar entrada
        if (!email ||!password) {
            return res.status(400).json({ message: 'Debes proporcionar un email y contraseña' });
        }

        // Buscar el usuario en la base de datos
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Crear y enviar el token JWT
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
                if (err) throw err;
                res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre } });
            }
        );

    }catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});