import express from 'express';
import { check } from 'express-validator';
import {
  listarVentas,
  obtenerVenta,
  registrarVenta,
  cancelarVenta,
  ventasPorFecha,
  ventasDelDia,
  ventasDelCliente,
  consultarStock
} from '../controladores/ventaControlador.js';
import { verificarToken, esAdmin, esVendedor } from '../middlewares/auth.js';
import { validarCampos } from '../middlewares/validaciones.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Verificar stock de un producto
router.get('/verificar-stock', consultarStock);

// Obtener todas las ventas
router.get('/', listarVentas);

// Obtener ventas del día
router.get('/hoy', ventasDelDia);

// Obtener ventas por rango de fechas
router.get('/por-fecha', ventasPorFecha);

// Obtener ventas de un cliente específico
router.get('/cliente/:cliente_id', ventasDelCliente);

// Obtener una venta por ID
router.get('/:id', obtenerVenta);

// Crear nueva venta (vendedores y admin)
router.post(
  '/',
  esVendedor,
  [
    check('cliente_id', 'El cliente es obligatorio').notEmpty(),
    check('cliente_id', 'El cliente debe ser un número').isInt(),
    check('productos', 'Debe incluir al menos un producto').isArray({ min: 1 }),
    check('productos.*.producto_id', 'El ID del producto es obligatorio').notEmpty(),
    check('productos.*.cantidad', 'La cantidad es obligatoria').isInt({ min: 1 }),
    check('productos.*.precio_unitario', 'El precio unitario es obligatorio').isFloat({ min: 0 }),
    check('descuento', 'El descuento debe ser un número').optional().isFloat({ min: 0 }),
    validarCampos
  ],
  registrarVenta
);

// Anular venta (solo admin)
router.delete('/:id', esAdmin, cancelarVenta);

export default router;