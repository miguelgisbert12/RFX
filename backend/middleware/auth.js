const jwt = require('jsonwebtoken');

// Middleware de autenticación
module.exports = function(req, res, next) {
    console.log('Middleware de autenticación ejecutándose');
  // Obtener el token del header
  const token = req.header('Authorization');

  // Verificar: si no hay token
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  try {
    // Verificar: si hay token
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    
    // Añadir el usuario a la petición
    req.usuario = decoded.usuario;
    console.log('Usuario decodificado del token:', req.usuario);
    
    next();
  } catch (err) {
    console.error('Token no válido:', err);
    res.status(401).json({ msg: 'Token no válido', error: err.message });
  }
};