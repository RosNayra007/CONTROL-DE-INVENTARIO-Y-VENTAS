import express from 'express';
import { check } from 'express-validator';
import {
  login,
  registro,
  logout,
  generarCaptcha,
  validarPassword,
  obtenerMisLogs,
  obtenerLogs
} from '../controladores/authControlador.js';
import { verificarToken, esAdmin } from '../middlewares/auth.js';
import { validarCampos } from '../middlewares/validaciones.js';

const router = express.Router();

// Ruta pública - Generar CAPTCHA
router.get('/captcha', generarCaptcha);

// Ruta pública - Login
router.post(
  '/login',
  [
    check('email', 'El email es obligatorio').notEmpty(),
    check('email', 'El formato del email no es válido').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    check('captchaId', 'El ID del captcha es obligatorio').notEmpty(),
    check('captchaText', 'El texto del captcha es obligatorio').notEmpty(),
    validarCampos
  ],
  login
);

// Ruta pública - Registro
router.post(
  '/registro',
  [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre', 'El nombre debe tener al menos 3 caracteres').isLength({ min: 3 }),
    check('email', 'El email es obligatorio').notEmpty(),
    check('email', 'El formato del email no es válido').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    validarCampos
  ],
  registro
);

// Ruta pública - Validar fortaleza de contraseña
router.post(
  '/validar-password',
  [
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
  ],
  validarPassword
);

// Ruta protegida - Logout
router.post('/logout', verificarToken, logout);

// Ruta protegida - Obtener mis logs
router.get('/mis-logs', verificarToken, obtenerMisLogs);

// Ruta protegida - Obtener todos los logs (solo admin)
router.get('/logs', verificarToken, esAdmin, obtenerLogs);

export default router;