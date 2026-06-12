import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Generar JWT Token
export const generarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Verificar Token
export const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      ok: false,
      mensaje: 'No se proporcionó token de autenticación'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Agregamos la info del usuario al request
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token inválido o expirado'
    });
  }
};

// Verificar rol de administrador
export const esAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({
      ok: false,
      mensaje: 'No tienes permisos para realizar esta acción'
    });
  }
  next();
};

// Verificar rol de vendedor o superior
export const esVendedor = (req, res, next) => {
  if (req.usuario.rol !== 'vendedor' && req.usuario.rol !== 'admin') {
    return res.status(403).json({
      ok: false,
      mensaje: 'No tienes permisos para realizar esta acción'
    });
  }
  next();
};