import { useState } from 'react';
import { ventasAPI, reportesAPI } from '../../services/api';
import { Calendar, Download, Eye, FileText, TrendingUp, DollarSign } from 'lucide-react';

const ReporteVentas = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const handleGenerar = async () => {
    if (!fechaInicio || !fechaFin) {
      alert('Debes seleccionar ambas fechas');
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      alert('La fecha de inicio no puede ser mayor a la fecha fin');
      return;
    }

    try {
      setLoading(true);
      const response = await ventasAPI.porFecha(fechaInicio, fechaFin);
      if (response.data.ok) {
        setVentas(response.data.ventas);
        setMostrarResultados(true);
      }
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleVerPDF = () => {
    if (ventas.length === 0) {
      alert('No hay datos para generar el reporte');
      return;
    }
    const url = reportesAPI.ventas(fechaInicio, fechaFin).ver;
    window.open(url, '_blank');
  };

  const handleDescargarPDF = () => {
    if (ventas.length === 0) {
      alert('No hay datos para generar el reporte');
      return;
    }
    const url = reportesAPI.ventas(fechaInicio, fechaFin).descargar;
    window.open(url, '_blank');
  };

  const calcularTotales = () => {
    const total = ventas.reduce((sum, v) => sum + parseFloat(v.total), 0);
    const promedio = ventas.length > 0 ? total / ventas.length : 0;
    return { total, promedio, cantidad: ventas.length };
  };

  const totales = calcularTotales();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Reporte de Ventas</h1>
        <p className="text-gray-600">Genera reportes de ventas por período</p>
      </div>

      {/* Formulario de filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Seleccionar Período
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              max={fechaFin || undefined}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min={fechaInicio || undefined}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerar}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                'Generando...'
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Generar Reporte
                </>
              )}
            </button>
          </div>
        </div>

        {/* Atajos de fechas */}
        <div className="mt-4 flex gap-2 flex-wrap">
          <button
            onClick={() => {
              const hoy = new Date().toISOString().split('T')[0];
              setFechaInicio(hoy);
              setFechaFin(hoy);
            }}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Hoy
          </button>
          <button
            onClick={() => {
              const hoy = new Date();
              const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
              setFechaInicio(inicioMes.toISOString().split('T')[0]);
              setFechaFin(hoy.toISOString().split('T')[0]);
            }}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Este Mes
          </button>
          <button
            onClick={() => {
              const hoy = new Date();
              const hace7Dias = new Date(hoy);
              hace7Dias.setDate(hace7Dias.getDate() - 7);
              setFechaInicio(hace7Dias.toISOString().split('T')[0]);
              setFechaFin(hoy.toISOString().split('T')[0]);
            }}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Últimos 7 días
          </button>
          <button
            onClick={() => {
              const hoy = new Date();
              const hace30Dias = new Date(hoy);
              hace30Dias.setDate(hace30Dias.getDate() - 30);
              setFechaInicio(hace30Dias.toISOString().split('T')[0]);
              setFechaFin(hoy.toISOString().split('T')[0]);
            }}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Últimos 30 días
          </button>
        </div>
      </div>

      {/* Resultados */}
      {mostrarResultados && (
        <>
          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Ventas</p>
                  <p className="text-3xl font-bold text-gray-800">{totales.cantidad}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Monto Total</p>
                  <p className="text-3xl font-bold text-green-600">
                    Bs. {totales.total.toFixed(2)}
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
                    Bs. {totales.promedio.toFixed(2)}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Acciones de PDF */}
          {ventas.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Exportar Reporte</h3>
              <div className="flex gap-4">
                <button
                  onClick={handleVerPDF}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Ver PDF en Navegador
                </button>
                <button
                  onClick={handleDescargarPDF}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Descargar PDF
                </button>
              </div>
            </div>
          )}

          {/* Tabla de ventas */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="font-semibold">Detalle de Ventas</h3>
              <p className="text-sm text-gray-600">
                Período: {new Date(fechaInicio).toLocaleDateString('es-BO')} al {new Date(fechaFin).toLocaleDateString('es-BO')}
              </p>
            </div>

            {ventas.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No se encontraron ventas en este período</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        No. Factura
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {ventas.map((venta) => (
                      <tr key={venta.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(venta.fecha_venta).toLocaleDateString('es-BO')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono font-semibold text-blue-600">
                            {venta.numero_factura}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {venta.cliente_nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {venta.vendedor_nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-sm font-bold text-green-600">
                            Bs. {parseFloat(venta.total).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-semibold">
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-right">
                        TOTAL:
                      </td>
                      <td className="px-6 py-4 text-right text-green-600">
                        Bs. {totales.total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReporteVentas;