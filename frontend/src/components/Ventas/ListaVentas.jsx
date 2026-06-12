import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ventasAPI, reportesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Eye, 
  Trash2, 
  Search, 
  Calendar,
  ShoppingCart,
  FileText,
  Download,
  DollarSign,
  User
} from 'lucide-react';

const ListaVentas = () => {
  const navigate = useNavigate();
  const { esAdmin } = useAuth();
  
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('todas'); // todas, hoy, mes

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      setLoading(true);
      const response = await ventasAPI.listar();
      if (response.data.ok) {
        setVentas(response.data.ventas);
      }
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      alert('Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  };

  const cargarVentasHoy = async () => {
    try {
      setLoading(true);
      const response = await ventasAPI.hoy();
      if (response.data.ok) {
        setVentas(response.data.ventas);
        setFiltroActivo('hoy');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarVentasPorFecha = async () => {
    if (!fechaInicio || !fechaFin) {
      alert('Debes seleccionar ambas fechas');
      return;
    }

    try {
      setLoading(true);
      const response = await ventasAPI.porFecha(fechaInicio, fechaFin);
      if (response.data.ok) {
        setVentas(response.data.ventas);
        setFiltroActivo('rango');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar ventas por fecha');
    } finally {
      setLoading(false);
    }
  };

  const handleAnular = async (id, numeroFactura) => {
    if (!esAdmin()) {
      alert('Solo los administradores pueden anular ventas');
      return;
    }

    if (!window.confirm(`¿Estás seguro de anular la venta ${numeroFactura}? El stock será restaurado.`)) {
      return;
    }

    try {
      const response = await ventasAPI.anular(id);
      if (response.data.ok) {
        alert('Venta anulada exitosamente');
        cargarVentas();
      }
    } catch (error) {
      console.error('Error al anular venta:', error);
      alert('Error al anular venta');
    }
  };

  const verFactura = (id) => {
    const url = reportesAPI.factura(id).ver;
    window.open(url, '_blank');
  };

  const descargarFactura = (id) => {
    const url = reportesAPI.factura(id).descargar;
    window.open(url, '_blank');
  };

  // Filtrar ventas
  const ventasFiltradas = ventas.filter(venta => {
    const cumpleBusqueda = 
      venta.numero_factura.toLowerCase().includes(busqueda.toLowerCase()) ||
      venta.cliente_nombre.toLowerCase().includes(busqueda.toLowerCase());
    
    return cumpleBusqueda;
  });

  // Calcular totales
  const totalVentas = ventasFiltradas.reduce((sum, v) => sum + parseFloat(v.total), 0);
  const cantidadVentas = ventasFiltradas.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Ventas</h1>
          <p className="text-gray-600">Historial de ventas realizadas</p>
        </div>
        <button
          onClick={() => navigate('/ventas/nueva')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Venta
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        {/* Búsqueda y filtros rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número de factura o cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={() => {
              cargarVentas();
              setFiltroActivo('todas');
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filtroActivo === 'todas'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>

          <button
            onClick={cargarVentasHoy}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filtroActivo === 'hoy'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Hoy
          </button>
        </div>

        {/* Filtro por rango de fechas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={cargarVentasPorFecha}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Filtrar
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Ventas</p>
              <p className="text-3xl font-bold text-gray-800">{cantidadVentas}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Monto Total</p>
              <p className="text-3xl font-bold text-green-600">
                Bs. {totalVentas.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Promedio por Venta</p>
              <p className="text-3xl font-bold text-purple-600">
                Bs. {cantidadVentas > 0 ? (totalVentas / cantidadVentas).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Factura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vendedor
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ventasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No se encontraron ventas</p>
                  </td>
                </tr>
              ) : (
                ventasFiltradas.map((venta) => (
                  <tr key={venta.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-semibold text-blue-600">
                        {venta.numero_factura}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(venta.fecha_venta).toLocaleDateString('es-BO')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(venta.fecha_venta).toLocaleTimeString('es-BO')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {venta.cliente_nombre}
                          </div>
                          {venta.cliente_nit && (
                            <div className="text-sm text-gray-500">
                              NIT: {venta.cliente_nit}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {venta.vendedor_nombre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-bold text-green-600">
                        Bs. {parseFloat(venta.total).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/ventas/${venta.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalle"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => verFactura(venta.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Ver factura"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => descargarFactura(venta.id)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Descargar factura"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        {esAdmin() && (
                          <button
                            onClick={() => handleAnular(venta.id, venta.numero_factura)}
                            className="text-red-600 hover:text-red-900"
                            title="Anular venta"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListaVentas;