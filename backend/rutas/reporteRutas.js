import express from 'express';
import {
  descargarFactura,
  verFactura,
  descargarReporteVentas,
  verReporteVentas
} from '../controladores/reporteControlador.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Factura de venta individual
router.get('/factura/:id/descargar', descargarFactura);
router.get('/factura/:id/ver', verFactura);

// Reporte de ventas por fecha
router.get('/ventas/descargar', descargarReporteVentas);
router.get('/ventas/ver', verReporteVentas);

export default router;