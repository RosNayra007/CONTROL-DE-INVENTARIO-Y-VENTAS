import express from 'express';
import { check } from 'express-validator';
import {
  listarClientes,
  obtenerCliente,
  insertarCliente,
  modificarCliente,
  borrarCliente
} from '../controladores/clienteControlador.js';
import { verificarToken, esAdmin } from '../middlewares/auth.js';
import { validarCampos } from '../middlewares/validaciones.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Obtener todos los clientes
router.get('/', listarClientes);

// Obtener un cliente por ID
router.get('/:id', obtenerCliente);

// Crear cliente
router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre', 'El nombre debe tener al menos 3 caracteres').isLength({ min: 3 }),
    check('email', 'El email debe ser válido').optional().isEmail(),
    validarCampos
  ],
  insertarCliente
);

// Actualizar cliente
router.put(
  '/:id',
  [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre', 'El nombre debe tener al menos 3 caracteres').isLength({ min: 3 }),
    check('email', 'El email debe ser válido').optional().isEmail(),
    validarCampos
  ],
  modificarCliente
);

// Eliminar cliente - Eliminación lógica (solo admin)
router.delete('/:id', esAdmin, borrarCliente);

export default router;