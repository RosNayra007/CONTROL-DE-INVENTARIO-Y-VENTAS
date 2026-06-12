import { db } from '../config/db.js';

// Obtener todos los productos activos (no eliminados)
export const obtenerTodosProductos = async () => {
  const [resultado] = await db.query(`
    SELECT p.*, c.nombre as categoria_nombre
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.eliminado = 0
    ORDER BY p.nombre ASC
  `);
  return resultado;
};

// Obtener producto por ID
export const obtenerProductoPorId = async (id) => {
  const [resultado] = await db.query(`
    SELECT p.*, c.nombre as categoria_nombre
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.id = ? AND p.eliminado = 0
  `, [id]);
  return resultado[0];
};

// Obtener producto por código
export const obtenerProductoPorCodigo = async (codigo) => {
  const [resultado] = await db.query(
    'SELECT * FROM productos WHERE codigo = ? AND eliminado = 0',
    [codigo]
  );
  return resultado[0];
};

// Crear nuevo producto
export const crearProducto = async (producto) => {
  const {
    codigo,
    nombre,
    descripcion,
    categoria_id,
    precio_compra,
    precio_venta,
    stock,
    stock_minimo,
    imagen
  } = producto;

  const [resultado] = await db.query(
    `INSERT INTO productos 
    (codigo, nombre, descripcion, categoria_id, precio_compra, precio_venta, stock, stock_minimo, imagen) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [codigo, nombre, descripcion, categoria_id, precio_compra, precio_venta, stock, stock_minimo, imagen]
  );

  return { id: resultado.insertId, ...producto };
};

// Actualizar producto
export const actualizarProducto = async (id, producto) => {
  const {
    codigo,
    nombre,
    descripcion,
    categoria_id,
    precio_compra,
    precio_venta,
    stock,
    stock_minimo,
    imagen
  } = producto;

  await db.query(
    `UPDATE productos 
    SET codigo = ?, nombre = ?, descripcion = ?, categoria_id = ?, 
        precio_compra = ?, precio_venta = ?, stock = ?, stock_minimo = ?, imagen = ?
    WHERE id = ? AND eliminado = 0`,
    [codigo, nombre, descripcion, categoria_id, precio_compra, precio_venta, stock, stock_minimo, imagen, id]
  );

  return { id, ...producto };
};

// Eliminar producto (eliminación lógica)
export const eliminarProducto = async (id) => {
  await db.query(
    'UPDATE productos SET eliminado = 1 WHERE id = ?',
    [id]
  );
  return id;
};

// Restaurar producto eliminado
export const restaurarProducto = async (id) => {
  await db.query(
    'UPDATE productos SET eliminado = 0 WHERE id = ?',
    [id]
  );
  return id;
};

// Obtener productos con stock bajo
export const obtenerProductosStockBajo = async () => {
  const [resultado] = await db.query(`
    SELECT p.*, c.nombre as categoria_nombre
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.stock <= p.stock_minimo AND p.eliminado = 0
    ORDER BY p.stock ASC
  `);
  return resultado;
};

// Actualizar stock de producto
export const actualizarStock = async (id, cantidad, operacion = 'restar') => {
  if (operacion === 'restar') {
    await db.query(
      'UPDATE productos SET stock = stock - ? WHERE id = ?',
      [cantidad, id]
    );
  } else {
    await db.query(
      'UPDATE productos SET stock = stock + ? WHERE id = ?',
      [cantidad, id]
    );
  }
};

// Obtener todas las categorías
export const obtenerCategorias = async () => {
  const [resultado] = await db.query(
    'SELECT * FROM categorias WHERE eliminado = 0 ORDER BY nombre ASC'
  );
  return resultado;
};