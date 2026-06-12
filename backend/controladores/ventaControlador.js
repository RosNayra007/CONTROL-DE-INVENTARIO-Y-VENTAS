import {
  obtenerTodasVentas,
  obtenerVentaPorId,
  crearVenta,
  anularVenta,
  obtenerVentasPorFecha,
  obtenerVentasHoy,
  obtenerVentasPorCliente,
  verificarStock
} from '../modelos/ventaModelo.js';

// Listar todas las ventas
export const listarVentas = async (req, res) => {
  try {
    const ventas = await obtenerTodasVentas();
    res.json({
      ok: true,
      ventas
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener ventas',
      error: error.message
    });
  }
};

// Obtener una venta por ID con detalles
export const obtenerVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await obtenerVentaPorId(id);

    if (!venta) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Venta no encontrada'
      });
    }

    res.json({
      ok: true,
      venta
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener la venta',
      error: error.message
    });
  }
};

// Crear nueva venta
export const registrarVenta = async (req, res) => {
  try {
    const { cliente_id, productos, descuento } = req.body;
    const usuario_id = req.usuario.id; // Del token JWT

    // Validar que haya productos
    if (!productos || productos.length === 0) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Debe incluir al menos un producto'
      });
    }

    // Verificar stock de todos los productos
    const productosInvalidos = [];
    for (const producto of productos) {
      const stockInfo = await verificarStock(producto.producto_id, producto.cantidad);
      if (!stockInfo.disponible) {
        productosInvalidos.push({
          producto_id: producto.producto_id,
          solicitado: producto.cantidad,
          disponible: stockInfo.stock,
          faltante: stockInfo.faltante
        });
      }
    }

    // Si hay productos sin stock, retornar error
    if (productosInvalidos.length > 0) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Stock insuficiente para algunos productos',
        productosInvalidos
      });
    }

    // Calcular subtotales
    const productosConSubtotal = productos.map(p => ({
      ...p,
      subtotal: p.cantidad * p.precio_unitario
    }));

    // Calcular totales
    const subtotal = productosConSubtotal.reduce((sum, p) => sum + p.subtotal, 0);
    const descuentoAplicado = descuento || 0;
    const total = subtotal - descuentoAplicado;

    // Crear venta
    const nuevaVenta = await crearVenta({
      cliente_id,
      usuario_id,
      subtotal,
      descuento: descuentoAplicado,
      total,
      productos: productosConSubtotal
    });

    res.status(201).json({
      ok: true,
      mensaje: 'Venta registrada exitosamente',
      venta: nuevaVenta
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al registrar la venta',
      error: error.message
    });
  }
};

// Anular venta (eliminación lógica)
export const cancelarVenta = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si la venta existe
    const ventaExiste = await obtenerVentaPorId(id);
    if (!ventaExiste) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Venta no encontrada'
      });
    }

    await anularVenta(id);

    res.json({
      ok: true,
      mensaje: 'Venta anulada exitosamente (stock restaurado)',
      id
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al anular la venta',
      error: error.message
    });
  }
};

// Obtener ventas por rango de fechas
export const ventasPorFecha = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Debe proporcionar fecha_inicio y fecha_fin'
      });
    }

    const ventas = await obtenerVentasPorFecha(fecha_inicio, fecha_fin);

    // Calcular total del período
    const totalPeriodo = ventas.reduce((sum, v) => sum + parseFloat(v.total), 0);

    res.json({
      ok: true,
      ventas,
      resumen: {
        cantidad: ventas.length,
        total: totalPeriodo
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener ventas por fecha',
      error: error.message
    });
  }
};

// Obtener ventas del día actual
export const ventasDelDia = async (req, res) => {
  try {
    const ventas = await obtenerVentasHoy();

    // Calcular total del día
    const totalDia = ventas.reduce((sum, v) => sum + parseFloat(v.total), 0);

    res.json({
      ok: true,
      ventas,
      resumen: {
        cantidad: ventas.length,
        total: totalDia
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener ventas del día',
      error: error.message
    });
  }
};

// Obtener ventas de un cliente específico
export const ventasDelCliente = async (req, res) => {
  try {
    const { cliente_id } = req.params;
    const ventas = await obtenerVentasPorCliente(cliente_id);

    // Calcular total de compras del cliente
    const totalCliente = ventas.reduce((sum, v) => sum + parseFloat(v.total), 0);

    res.json({
      ok: true,
      ventas,
      resumen: {
        cantidad: ventas.length,
        total: totalCliente
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener ventas del cliente',
      error: error.message
    });
  }
};

// Verificar disponibilidad de stock
export const consultarStock = async (req, res) => {
  try {
    const { producto_id, cantidad } = req.query;

    if (!producto_id || !cantidad) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Debe proporcionar producto_id y cantidad'
      });
    }

    const stockInfo = await verificarStock(producto_id, parseInt(cantidad));

    res.json({
      ok: true,
      ...stockInfo
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al verificar stock',
      error: error.message
    });
  }
};