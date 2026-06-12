import express from 'express';
import { check } from 'express-validator';
import {
  listarProductos,
  obtenerProducto,
  insertarProducto,
  modificarProducto,
  borrarProducto,
  recuperarProducto,
  stockBajo,
  listarCategorias
} from '../controladores/productoControlador.js';
import { verificarToken, esAdmin } from '../middlewares/auth.js';
import { validarCampos } from '../middlewares/validaciones.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Obtener todas las categorías
router.get('/categorias', listarCategorias);

// Obtener todos los productos
router.get('/', listarProductos);

// Obtener productos con stock bajo
router.get('/stock-bajo', stockBajo);

// Obtener un producto por ID
router.get('/:id', obtenerProducto);

// Crear producto (solo admin o almacen)
router.post(
  '/',
  [
    check('codigo', 'El código es obligatorio').notEmpty(),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre', 'El nombre debe tener al menos 3 caracteres').isLength({ min: 3 }),
    check('categoria_id', 'La categoría es obligatoria').notEmpty(),
    check('categoria_id', 'La categoría debe ser un número').isInt(),
    check('precio_compra', 'El precio de compra es obligatorio').notEmpty(),
    check('precio_compra', 'El precio de compra debe ser un número').isFloat({ min: 0 }),
    check('precio_venta', 'El precio de venta es obligatorio').notEmpty(),
    check('precio_venta', 'El precio de venta debe ser un número').isFloat({ min: 0 }),
    check('stock', 'El stock debe ser un número').optional().isInt({ min: 0 }),
    check('stock_minimo', 'El stock mínimo debe ser un número').optional().isInt({ min: 0 }),
    validarCampos
  ],
  insertarProducto
);

// Actualizar producto (solo admin o almacen)
router.put(
  '/:id',
  [
    check('codigo', 'El código es obligatorio').notEmpty(),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre', 'El nombre debe tener al menos 3 caracteres').isLength({ min: 3 }),
    check('categoria_id', 'La categoría es obligatoria').notEmpty(),
    check('categoria_id', 'La categoría debe ser un número').isInt(),
    check('precio_compra', 'El precio de compra es obligatorio').notEmpty(),
    check('precio_compra', 'El precio de compra debe ser un número').isFloat({ min: 0 }),
    check('precio_venta', 'El precio de venta es obligatorio').notEmpty(),
    check('precio_venta', 'El precio de venta debe ser un número').isFloat({ min: 0 }),
    check('stock', 'El stock debe ser un número').optional().isInt({ min: 0 }),
    check('stock_minimo', 'El stock mínimo debe ser un número').optional().isInt({ min: 0 }),
    validarCampos
  ],
  modificarProducto
);

// Eliminar producto - Eliminación lógica (solo admin)
router.delete('/:id', esAdmin, borrarProducto);

// Restaurar producto eliminado (solo admin)
router.patch('/:id/restaurar', esAdmin, recuperarProducto);

export default router;