import { db } from '../config/db.js';

// Obtener estadísticas generales
export const obtenerEstadisticasGenerales = async () => {
  // Total de productos
  const [totalProductos] = await db.query(
    'SELECT COUNT(*) as total FROM productos WHERE eliminado = 0'
  );

  // Total de clientes
  const [totalClientes] = await db.query(
    'SELECT COUNT(*) as total FROM clientes WHERE eliminado = 0'
  );

  // Total de ventas
  const [totalVentas] = await db.query(
    'SELECT COUNT(*) as total FROM ventas WHERE eliminado = 0'
  );

  // Total de ventas del día
  const [ventasHoy] = await db.query(
    'SELECT COUNT(*) as total, COALESCE(SUM(total), 0) as monto FROM ventas WHERE DATE(fecha_venta) = CURDATE() AND eliminado = 0'
  );

  // Total de ventas del mes
  const [ventasMes] = await db.query(
    'SELECT COUNT(*) as total, COALESCE(SUM(total), 0) as monto FROM ventas WHERE MONTH(fecha_venta) = MONTH(CURDATE()) AND YEAR(fecha_venta) = YEAR(CURDATE()) AND eliminado = 0'
  );

  // Productos con stock bajo
  const [stockBajo] = await db.query(
    'SELECT COUNT(*) as total FROM productos WHERE stock <= stock_minimo AND eliminado = 0'
  );

  return {
    totalProductos: totalProductos[0].total,
    totalClientes: totalClientes[0].total,
    totalVentas: totalVentas[0].total,
    ventasHoy: {
      cantidad: ventasHoy[0].total,
      monto: parseFloat(ventasHoy[0].monto)
    },
    ventasMes: {
      cantidad: ventasMes[0].total,
      monto: parseFloat(ventasMes[0].monto)
    },
    productosStockBajo: stockBajo[0].total
  };
};

// Ventas por mes (últimos 6 meses) - Para gráfico de líneas
export const obtenerVentasPorMes = async () => {
  const [resultado] = await db.query(`
    SELECT 
      DATE_FORMAT(fecha_venta, '%Y-%m') as mes,
      DATE_FORMAT(fecha_venta, '%M %Y') as mes_nombre,
      COUNT(*) as cantidad,
      COALESCE(SUM(total), 0) as total
    FROM ventas
    WHERE fecha_venta >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      AND eliminado = 0
    GROUP BY DATE_FORMAT(fecha_venta, '%Y-%m')
    ORDER BY mes ASC
  `);

  return resultado.map(r => ({
    mes: r.mes,
    mesNombre: r.mes_nombre,
    cantidad: r.cantidad,
    total: parseFloat(r.total)
  }));
};

// Productos más vendidos - Para gráfico de barras
export const obtenerProductosMasVendidos = async (limite = 10) => {
  const [resultado] = await db.query(`
    SELECT 
      p.id,
      p.nombre,
      p.codigo,
      SUM(dv.cantidad) as cantidad_vendida,
      SUM(dv.subtotal) as total_vendido
    FROM detalle_ventas dv
    INNER JOIN productos p ON dv.producto_id = p.id
    INNER JOIN ventas v ON dv.venta_id = v.id
    WHERE v.eliminado = 0
    GROUP BY p.id, p.nombre, p.codigo
    ORDER BY cantidad_vendida DESC
    LIMIT ?
  `, [limite]);

  return resultado.map(r => ({
    id: r.id,
    nombre: r.nombre,
    codigo: r.codigo,
    cantidadVendida: r.cantidad_vendida,
    totalVendido: parseFloat(r.total_vendido)
  }));
};

// Ventas por categoría - Para gráfico circular (pie chart)
export const obtenerVentasPorCategoria = async () => {
  const [resultado] = await db.query(`
    SELECT 
      c.nombre as categoria,
      COUNT(DISTINCT v.id) as cantidad_ventas,
      SUM(dv.cantidad) as productos_vendidos,
      SUM(dv.subtotal) as total_vendido
    FROM detalle_ventas dv
    INNER JOIN productos p ON dv.producto_id = p.id
    INNER JOIN categorias c ON p.categoria_id = c.id
    INNER JOIN ventas v ON dv.venta_id = v.id
    WHERE v.eliminado = 0 AND c.eliminado = 0
    GROUP BY c.id, c.nombre
    ORDER BY total_vendido DESC
  `);

  return resultado.map(r => ({
    categoria: r.categoria,
    cantidadVentas: r.cantidad_ventas,
    productosVendidos: r.productos_vendidos,
    totalVendido: parseFloat(r.total_vendido)
  }));
};

// Clientes con más compras
export const obtenerClientesTop = async (limite = 10) => {
  const [resultado] = await db.query(`
    SELECT 
      c.id,
      c.nombre,
      c.nit,
      COUNT(v.id) as cantidad_compras,
      SUM(v.total) as total_comprado
    FROM ventas v
    INNER JOIN clientes c ON v.cliente_id = c.id
    WHERE v.eliminado = 0
    GROUP BY c.id, c.nombre, c.nit
    ORDER BY total_comprado DESC
    LIMIT ?
  `, [limite]);

  return resultado.map(r => ({
    id: r.id,
    nombre: r.nombre,
    nit: r.nit,
    cantidadCompras: r.cantidad_compras,
    totalComprado: parseFloat(r.total_comprado)
  }));
};

// Ventas diarias del mes actual - Para gráfico de líneas detallado
export const obtenerVentasDiarias = async () => {
  const [resultado] = await db.query(`
    SELECT 
      DATE(fecha_venta) as fecha,
      DATE_FORMAT(fecha_venta, '%d/%m') as fecha_corta,
      COUNT(*) as cantidad,
      SUM(total) as total
    FROM ventas
    WHERE MONTH(fecha_venta) = MONTH(CURDATE())
      AND YEAR(fecha_venta) = YEAR(CURDATE())
      AND eliminado = 0
    GROUP BY DATE(fecha_venta)
    ORDER BY fecha ASC
  `);

  return resultado.map(r => ({
    fecha: r.fecha,
    fechaCorta: r.fecha_corta,
    cantidad: r.cantidad,
    total: parseFloat(r.total)
  }));
};

// Resumen de inventario por categoría
export const obtenerInventarioPorCategoria = async () => {
  const [resultado] = await db.query(`
    SELECT 
      c.nombre as categoria,
      COUNT(p.id) as cantidad_productos,
      SUM(p.stock) as stock_total,
      SUM(p.stock * p.precio_venta) as valor_inventario
    FROM productos p
    INNER JOIN categorias c ON p.categoria_id = c.id
    WHERE p.eliminado = 0
    GROUP BY c.id, c.nombre
    ORDER BY valor_inventario DESC
  `);

  return resultado.map(r => ({
    categoria: r.categoria,
    cantidadProductos: r.cantidad_productos,
    stockTotal: r.stock_total,
    valorInventario: parseFloat(r.valor_inventario)
  }));
};