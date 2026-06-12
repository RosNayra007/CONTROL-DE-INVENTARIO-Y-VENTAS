import PDFDocument from 'pdfkit';
import { obtenerVentaPorId } from '../modelos/ventaModelo.js';

// Generar factura en PDF
export const generarFacturaPDF = async (venta_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtener datos de la venta
      const venta = await obtenerVentaPorId(venta_id);

      if (!venta) {
        reject(new Error('Venta no encontrada'));
        return;
      }

      // Crear documento PDF
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Encabezado de la empresa
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('TIENDA XYZ', 50, 50)
        .fontSize(10)
        .font('Helvetica')
        .text('NIT: 123456789', 50, 75)
        .text('Dirección: Calle Principal #123, La Paz, Bolivia', 50, 90)
        .text('Teléfono: (591) 2-1234567', 50, 105)
        .text('Email: contacto@tiendaxyz.com', 50, 120);

      // Línea divisoria
      doc
        .moveTo(50, 140)
        .lineTo(550, 140)
        .stroke();

      // Título FACTURA
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('FACTURA', 50, 150);

      // Información de la factura
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`No. Factura: ${venta.numero_factura}`, 380, 150)
        .text(`Fecha: ${new Date(venta.fecha_venta).toLocaleDateString('es-BO')}`, 380, 165)
        .text(`Hora: ${new Date(venta.fecha_venta).toLocaleTimeString('es-BO')}`, 380, 180);

      // Información del cliente
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('DATOS DEL CLIENTE', 50, 200);

      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`Cliente: ${venta.cliente_nombre}`, 50, 220)
        .text(`NIT/CI: ${venta.cliente_nit || 'S/N'}`, 50, 235)
        .text(`Teléfono: ${venta.cliente_telefono || 'N/A'}`, 50, 250)
        .text(`Dirección: ${venta.cliente_direccion || 'N/A'}`, 50, 265);

      // Línea divisoria
      doc
        .moveTo(50, 285)
        .lineTo(550, 285)
        .stroke();

      // Tabla de productos
      const tableTop = 300;
      const itemCodeX = 50;
      const descriptionX = 120;
      const quantityX = 350;
      const priceX = 420;
      const totalX = 490;

      // Encabezados de la tabla
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('CÓDIGO', itemCodeX, tableTop)
        .text('DESCRIPCIÓN', descriptionX, tableTop)
        .text('CANT.', quantityX, tableTop)
        .text('P. UNIT.', priceX, tableTop)
        .text('SUBTOTAL', totalX, tableTop);

      // Línea bajo encabezados
      doc
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      // Productos
      let position = tableTop + 25;
      doc.font('Helvetica').fontSize(9);

      venta.detalles.forEach((detalle, index) => {
        if (position > 700) {
          doc.addPage();
          position = 50;
        }

        doc
          .text(detalle.producto_codigo, itemCodeX, position)
          .text(detalle.producto_nombre, descriptionX, position, { width: 220 })
          .text(detalle.cantidad.toString(), quantityX, position)
          .text(`Bs. ${parseFloat(detalle.precio_unitario).toFixed(2)}`, priceX, position)
          .text(`Bs. ${parseFloat(detalle.subtotal).toFixed(2)}`, totalX, position);

        position += 20;
      });

      // Línea antes de totales
      position += 10;
      doc
        .moveTo(350, position)
        .lineTo(550, position)
        .stroke();

      // Totales
      position += 15;
      doc
        .fontSize(10)
        .font('Helvetica')
        .text('SUBTOTAL:', 380, position)
        .text(`Bs. ${parseFloat(venta.subtotal).toFixed(2)}`, 490, position, { align: 'right' });

      if (venta.descuento > 0) {
        position += 20;
        doc
          .text('DESCUENTO:', 380, position)
          .text(`Bs. ${parseFloat(venta.descuento).toFixed(2)}`, 490, position, { align: 'right' });
      }

      position += 20;
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('TOTAL:', 380, position)
        .text(`Bs. ${parseFloat(venta.total).toFixed(2)}`, 490, position, { align: 'right' });

      // Información adicional
      position += 40;
      doc
        .fontSize(9)
        .font('Helvetica')
        .text(`Vendedor: ${venta.vendedor_nombre}`, 50, position)
        .text('Esta factura contribuye al desarrollo del país.', 50, position + 15)
        .text('El uso ilícito de esta será sancionado de acuerdo a Ley.', 50, position + 30);

      // Pie de página
      doc
        .fontSize(8)
        .font('Helvetica-Oblique')
        .text(
          'Gracias por su preferencia',
          50,
          doc.page.height - 50,
          { align: 'center', width: 500 }
        );

      // Finalizar PDF
      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};

// Generar reporte de ventas en PDF
export const generarReporteVentasPDF = async (ventas, fechaInicio, fechaFin) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Encabezado
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('REPORTE DE VENTAS', 50, 50, { align: 'center' });

      doc
        .fontSize(12)
        .font('Helvetica')
        .text(`Período: ${fechaInicio} al ${fechaFin}`, 50, 80, { align: 'center' });

      // Línea divisoria
      doc
        .moveTo(50, 100)
        .lineTo(550, 100)
        .stroke();

      // Tabla
      const tableTop = 120;
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('FECHA', 50, tableTop)
        .text('No. FACTURA', 130, tableTop)
        .text('CLIENTE', 230, tableTop)
        .text('VENDEDOR', 360, tableTop)
        .text('TOTAL', 480, tableTop);

      doc
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      let position = tableTop + 25;
      let totalGeneral = 0;

      doc.font('Helvetica').fontSize(9);

      ventas.forEach((venta) => {
        if (position > 700) {
          doc.addPage();
          position = 50;
        }

        const fecha = new Date(venta.fecha_venta).toLocaleDateString('es-BO');
        
        doc
          .text(fecha, 50, position)
          .text(venta.numero_factura, 130, position)
          .text(venta.cliente_nombre, 230, position, { width: 120 })
          .text(venta.vendedor_nombre, 360, position, { width: 110 })
          .text(`Bs. ${parseFloat(venta.total).toFixed(2)}`, 480, position);

        totalGeneral += parseFloat(venta.total);
        position += 20;
      });

      // Total general
      position += 10;
      doc
        .moveTo(350, position)
        .lineTo(550, position)
        .stroke();

      position += 15;
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('TOTAL GENERAL:', 350, position)
        .text(`Bs. ${totalGeneral.toFixed(2)}`, 480, position);

      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`Cantidad de ventas: ${ventas.length}`, 350, position + 20);

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};