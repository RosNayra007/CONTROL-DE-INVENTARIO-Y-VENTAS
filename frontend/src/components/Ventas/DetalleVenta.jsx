import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ventasAPI, reportesAPI } from '../../services/api';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  User, 
  MapPin, 
  Phone,
  Calendar,
  Package,
  DollarSign,
  Receipt
} from 'lucide-react';

const DetalleVenta = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarVenta();
  }, [id]);

  const cargarVenta = async () => {
    try {
      const response = await ventasAPI.obtener(id);
      if (response.data.ok) {
        setVenta(response.data.venta);
      }
    } catch (error) {
      console.error('Error al cargar venta:', error);
      alert('Error al cargar venta');
      navigate('/ventas');
    } finally {
      setLoading(false);
    }
  };

  const verFactura = () => {
    const url = reportesAPI.factura(id).ver;
    window.open(url, '_blank');
  };

  const descargarFactura = () => {
    const url = reportesAPI.factura(id).descargar;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!venta) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Venta no encontrada</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/ventas')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Detalle de Venta</h1>
            <p className="text-gray-600">Factura: {venta.numero_factura}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={verFactura}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Ver Factura
          </button>
          <button
            onClick={descargarFactura}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Descargar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información de la factura */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Información de la Factura</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Número de Factura</p>
                <p className="font-mono font-bold text-blue-600">{venta.numero_factura}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha y Hora</p>
                <p className="font-semibold">
                  {new Date(venta.fecha_venta).toLocaleDateString('es-BO')}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(venta.fecha_venta).toLocaleTimeString('es-BO')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vendedor</p>
                <p className="font-semibold">{venta.vendedor_nombre}</p>
              </div>
            </div>
          </div>

          {/* Información del cliente */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Datos del Cliente</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-semibold">{venta.cliente_nombre}</p>
                </div>
              </div>
              
              {venta.cliente_nit && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">NIT/CI</p>
                    <p className="font-semibold">{venta.cliente_nit}</p>
                  </div>
                </div>
              )}
              
              {venta.cliente_telefono && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-semibold">{venta.cliente_telefono}</p>
                  </div>
                </div>
              )}
              
              {venta.cliente_direccion && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-semibold">{venta.cliente_direccion}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detalles de productos */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold">Productos Vendidos</h2>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Precio Unit.
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {venta.detalles && venta.detalles.map((detalle, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-600">
                          {detalle.producto_codigo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {detalle.producto_nombre}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-gray-900">
                          {detalle.cantidad}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-gray-900">
                          Bs. {parseFloat(detalle.precio_unitario).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          Bs. {parseFloat(detalle.subtotal).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar - Resumen de pago */}
        <div className="space-y-6">
          {/* Total */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Total de la Venta</p>
            <p className="text-5xl font-bold mb-1">
              Bs. {parseFloat(venta.total).toFixed(2)}
            </p>
          </div>

          {/* Desglose */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Desglose de Pago
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  Bs. {parseFloat(venta.subtotal).toFixed(2)}
                </span>
              </div>
              
              {venta.descuento > 0 && (
                <div className="flex justify-between items-center pb-3 border-b text-red-600">
                  <span>Descuento</span>
                  <span className="font-semibold">
                    - Bs. {parseFloat(venta.descuento).toFixed(2)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-green-600">
                  Bs. {parseFloat(venta.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Resumen de la Venta</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Total Productos</span>
                <span className="font-bold">
                  {venta.detalles?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Total Unidades</span>
                <span className="font-bold">
                  {venta.detalles?.reduce((sum, d) => sum + d.cantidad, 0) || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Precio Promedio</span>
                <span className="font-bold">
                  Bs. {venta.detalles?.length > 0 
                    ? (parseFloat(venta.subtotal) / venta.detalles.reduce((sum, d) => sum + d.cantidad, 0)).toFixed(2)
                    : '0.00'}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Acciones</h3>
            <div className="space-y-2">
              <button
                onClick={verFactura}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Ver Factura
              </button>
              <button
                onClick={descargarFactura}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </button>
              <button
                onClick={() => navigate('/ventas')}
                className="w-full border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg"
              >
                Volver al Listado
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleVenta;