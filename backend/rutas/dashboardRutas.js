import express from 'express';
import {
  obtenerDashboard,
  obtenerEstadisticas,
  graficoVentasMes,
  graficoProductosTop,
  graficoVentasCategoria,
  obtenerMejoresClientes,
  graficoVentasDiarias,
  graficoInventario
} from '../controladores/dashboardControlador.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Obtener dashboard completo
router.get('/', obtenerDashboard);

// Obtener solo estadísticas generales
router.get('/estadisticas', obtenerEstadisticas);

// Gráficos individuales
router.get('/graficos/ventas-mes', graficoVentasMes);
router.get('/graficos/ventas-diarias', graficoVentasDiarias);
router.get('/graficos/productos-top', graficoProductosTop);
router.get('/graficos/ventas-categoria', graficoVentasCategoria);
router.get('/graficos/inventario', graficoInventario);

// Top clientes
router.get('/clientes-top', obtenerMejoresClientes);

export default router;