import { db } from '../config/db.js';

// Obtener todas las ventas
export const obtenerTodasVentas = async () => {
  const [resultado] = await db.query(`
    SELECT v.*, 
           c.nombre as cliente_nombre, 
           c.nit as cliente_nit,
           u.nombre as vendedor_nombre
    FROM ventas v
    INNER JOIN clientes c ON v.cliente_id = c.id
    INNER JOIN usuarios u ON v.usuario_id = u.id
    WHERE v.eliminado = 0
    ORDER BY v.fecha_venta DESC
  `);
  return resultado;
};

// Obtener venta por ID con detalles
export const obtenerVentaPorId = async (id) => {
  // Obtener datos de la venta
  const [venta] = await db.query(`
    SELECT v.*, 
           c.nombre as cliente_nombre, 
           c.nit as cliente_nit,
           c.telefono as cliente_telefono,
           c.direccion as cliente_direccion,
           u.nombre as vendedor_nombre
    FROM ventas v
    INNER JOIN clientes c ON v.cliente_id = c.id
    INNER JOIN usuarios u ON v.usuario_id = u.id
    WHERE v.id = ? AND v.eliminado = 0
  `, [id]);

  if (venta.length === 0) {
    return null;
  }

  // Obtener detalles de la venta
  const [detalles] = await db.query(`
    SELECT dv.*, 
           p.nombre as producto_nombre,
           p.codigo as producto_codigo
    FROM detalle_ventas dv
    INNER JOIN productos p ON dv.producto_id = p.id
    WHERE dv.venta_id = ?
  `, [id]);

  return {
    ...venta[0],
    detalles
  };
};

// Generar número de factura único
export const generarNumeroFactura = async () => {
  const [resultado] = await db.query(
    'SELECT MAX(CAST(SUBSTRING(numero_factura, 6) AS UNSIGNED)) as ultimo FROM ventas'
  );
  
  const ultimo = resultado[0].ultimo || 0;
  const siguiente = ultimo + 1;
  const numeroFactura = `FACT-${String(siguiente).padStart(6, '0')}`;
  
  return numeroFactura;
};

// Crear nueva venta con transacción
export const crearVenta = async (ventaData) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { cliente_id, usuario_id, subtotal, descuento, total, productos } = ventaData;

    // Generar número de factura
    const numero_factura = await generarNumeroFactura();

    // Insertar venta
    const [resultadoVenta] = await connection.query(
      `INSERT INTO ventas (numero_factura, cliente_id, usuario_id, subtotal, descuento, total) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [numero_factura, cliente_id, usuario_id, subtotal, descuento, total]
    );

    const venta_id = resultadoVenta.insertId;

    // Insertar detalles de venta y actualizar stock
    for (const producto of productos) {
      // Insertar detalle
      await connection.query(
        `INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) 
         VALUES (?, ?, ?, ?, ?)`,
        [venta_id, producto.producto_id, producto.cantidad, producto.precio_unitario, producto.subtotal]
      );

      // Actualizar stock del producto
      await connection.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [producto.cantidad, producto.producto_id]
      );
    }

    await connection.commit();

    return {
      id: venta_id,
      numero_factura,
      cliente_id,
      usuario_id,
      subtotal,
      descuento,
      total,
      productos
    };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Anular venta (eliminación lógica)
export const anularVenta = async (id) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // Obtener detalles de la venta para restaurar stock
    const [detalles] = await connection.query(
      'SELECT producto_id, cantidad FROM detalle_ventas WHERE venta_id = ?',
      [id]
    );

    // Restaurar stock de cada producto
    for (const detalle of detalles) {
      await connection.query(
        'UPDATE productos SET stock = stock + ? WHERE id = ?',
        [detalle.cantidad, detalle.producto_id]
      );
    }

    // Marcar venta como eliminada
    await connection.query(
      'UPDATE ventas SET eliminado = 1 WHERE id = ?',
      [id]
    );

    await connection.commit();
    return id;

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Obtener ventas por rango de fechas
export const obtenerVentasPorFecha = async (fecha_inicio, fecha_fin) => {
  const [resultado] = await db.query(`
    SELECT v.*, 
           c.nombre as cliente_nombre, 
           u.nombre as vendedor_nombre
    FROM ventas v
    INNER JOIN clientes c ON v.cliente_id = c.id
    INNER JOIN usuarios u ON v.usuario_id = u.id
    WHERE DATE(v.fecha_venta) BETWEEN ? AND ? AND v.eliminado = 0
    ORDER BY v.fecha_venta DESC
  `, [fecha_inicio, fecha_fin]);
  
  return resultado;
};

// Obtener ventas del día actual
export const obtenerVentasHoy = async () => {
  const [resultado] = await db.query(`
    SELECT v.*, 
           c.nombre as cliente_nombre, 
           u.nombre as vendedor_nombre
    FROM ventas v
    INNER JOIN clientes c ON v.cliente_id = c.id
    INNER JOIN usuarios u ON v.usuario_id = u.id
    WHERE DATE(v.fecha_venta) = CURDATE() AND v.eliminado = 0
    ORDER BY v.fecha_venta DESC
  `);
  
  return resultado;
};

// Obtener ventas por cliente
export const obtenerVentasPorCliente = async (cliente_id) => {
  const [resultado] = await db.query(`
    SELECT v.*, u.nombre as vendedor_nombre
    FROM ventas v
    INNER JOIN usuarios u ON v.usuario_id = u.id
    WHERE v.cliente_id = ? AND v.eliminado = 0
    ORDER BY v.fecha_venta DESC
  `, [cliente_id]);
  
  return resultado;
};

// Verificar stock disponible de un producto
export const verificarStock = async (producto_id, cantidad) => {
  const [resultado] = await db.query(
    'SELECT stock FROM productos WHERE id = ? AND eliminado = 0',
    [producto_id]
  );
  
  if (resultado.length === 0) {
    return { disponible: false, stock: 0 };
  }
  
  const stockDisponible = resultado[0].stock;
  return {
    disponible: stockDisponible >= cantidad,
    stock: stockDisponible,
    faltante: cantidad - stockDisponible
  };
};