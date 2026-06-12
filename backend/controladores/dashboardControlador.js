import {
  obtenerEstadisticasGenerales,
  obtenerVentasPorMes,
  obtenerProductosMasVendidos,
  obtenerVentasPorCategoria,
  obtenerClientesTop,
  obtenerVentasDiarias,
  obtenerInventarioPorCategoria
} from '../modelos/dashboardModelo.js';

// Obtener todas las estadísticas del dashboard
export const obtenerDashboard = async (req, res) => {
  try {
    const estadisticas = await obtenerEstadisticasGenerales();
    const ventasPorMes = await obtenerVentasPorMes();
    const productosMasVendidos = await obtenerProductosMasVendidos(5);
    const ventasPorCategoria = await obtenerVentasPorCategoria();

    res.json({
      ok: true,
      estadisticas,
      graficos: {
        ventasPorMes,
        productosMasVendidos,
        ventasPorCategoria
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener datos del dashboard',
      error: error.message
    });
  }
};

// Obtener estadísticas generales
export const obtenerEstadisticas = async (req, res) => {
  try {
    const estadisticas = await obtenerEstadisticasGenerales();
    res.json({
      ok: true,
      estadisticas
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

// Gráfico: Ventas por mes
export const graficoVentasMes = async (req, res) => {
  try {
    const datos = await obtenerVentasPorMes();
    res.json({
      ok: true,
      datos
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener ventas por mes',
      error: error.message
    });
  }
};

// Gráfico: Productos más vendidos
export const graficoProductosTop = async (req, res) => {
  try {
    const { limite } = req.query;
    const datos = await obtenerProductosMasVendidos(parseInt(limite) || 10);
    res.json({
      ok: true,
      datos
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener productos más vendidos',
      error: error.message
    });
  }
};

// Gráfico: Ventas por categoría
export const graficoVentasCategoria = async (req, res) => {
  try {
    const datos = await obtenerVentasPorCategoria();
    res.json({
      ok: true,
      datos
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener ventas por categoría',
      error: error.message
    });
  }
};

// Clientes con más compras
export const obtenerMejoresClientes = async (req, res) => {
  try {
    const { limite } = req.query;
    const datos = await obtenerClientesTop(parseInt(limite) || 10);
    res.json({
      ok: true,
      datos
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener mejores clientes',
      error: error.message
    });
  }
};

// Gráfico: Ventas diarias del mes
export const graficoVentasDiarias = async (req, res) => {
  try {
    const datos = await obtenerVentasDiarias();
    res.json({
      ok: true,
      datos
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener ventas diarias',
      error: error.message
    });
  }
};

// Gráfico: Inventario por categoría
export const graficoInventario = async (req, res) => {
  try {
    const datos = await obtenerInventarioPorCategoria();
    res.json({
      ok: true,
      datos
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener inventario por categoría',
      error: error.message
    });
  }
};