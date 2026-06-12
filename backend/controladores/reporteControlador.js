import { generarFacturaPDF, generarReporteVentasPDF } from '../utils/pdf.js';
import { obtenerVentasPorFecha } from '../modelos/ventaModelo.js';

// Generar factura PDF de una venta
export const descargarFactura = async (req, res) => {
  try {
    const { id } = req.params;

    const pdfBuffer = await generarFacturaPDF(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=factura-${id}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al generar la factura',
      error: error.message
    });
  }
};

// Visualizar factura PDF en el navegador
export const verFactura = async (req, res) => {
  try {
    const { id } = req.params;

    const pdfBuffer = await generarFacturaPDF(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=factura-${id}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al visualizar la factura',
      error: error.message
    });
  }
};

// Generar reporte de ventas por fecha
export const descargarReporteVentas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Debe proporcionar fecha_inicio y fecha_fin'
      });
    }

    // Obtener ventas del período
    const ventas = await obtenerVentasPorFecha(fecha_inicio, fecha_fin);

    if (ventas.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontraron ventas en el período especificado'
      });
    }

    // Generar PDF
    const pdfBuffer = await generarReporteVentasPDF(ventas, fecha_inicio, fecha_fin);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte-ventas-${fecha_inicio}-${fecha_fin}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al generar el reporte',
      error: error.message
    });
  }
};

// Ver reporte de ventas en el navegador
export const verReporteVentas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Debe proporcionar fecha_inicio y fecha_fin'
      });
    }

    const ventas = await obtenerVentasPorFecha(fecha_inicio, fecha_fin);

    if (ventas.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontraron ventas en el período especificado'
      });
    }

    const pdfBuffer = await generarReporteVentasPDF(ventas, fecha_inicio, fecha_fin);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=reporte-ventas-${fecha_inicio}-${fecha_fin}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al visualizar el reporte',
      error: error.message
    });
  }
};