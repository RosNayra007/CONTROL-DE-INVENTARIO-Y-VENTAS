import { useState, useEffect } from 'react';
import { productosAPI } from '../../services/api';
import { Package, AlertTriangle, TrendingUp, DollarSign, Download } from 'lucide-react';

const ReporteInventario = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [filtroStock, setFiltroStock] = useState('todos'); // todos, bajo, normal

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resProductos, resCategorias] = await Promise.all([
        productosAPI.listar(),
        productosAPI.categorias()
      ]);

      if (resProductos.data.ok) {
        setProductos(resProductos.data.productos);
      }
      if (resCategorias.data.ok) {
        setCategorias(resCategorias.data.categorias);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const cumpleCategoria = categoriaFiltro === '' || producto.categoria_id === parseInt(categoriaFiltro);
    
    let cumpleStock = true;
    if (filtroStock === 'bajo') {
      cumpleStock = producto.stock <= producto.stock_minimo;
    } else if (filtroStock === 'normal') {
      cumpleStock = producto.stock > producto.stock_minimo;
    }
    
    return cumpleCategoria && cumpleStock;
  });

  // Calcular totales
  const calcularEstadisticas = () => {
    const totalProductos = productosFiltrados.length;
    const stockTotal = productosFiltrados.reduce((sum, p) => sum + p.stock, 0);
    const valorInventario = productosFiltrados.reduce(
      (sum, p) => sum + (p.stock * parseFloat(p.precio_venta)), 
      0
    );
    const valorCompra = productosFiltrados.reduce(
      (sum, p) => sum + (p.stock * parseFloat(p.precio_compra)), 
      0
    );
    const gananciaPotencial = valorInventario - valorCompra;
    const stockBajo = productosFiltrados.filter(p => p.stock <= p.stock_minimo).length;

    return {
      totalProductos,
      stockTotal,
      valorInventario,
      valorCompra,
      gananciaPotencial,
      stockBajo
    };
  };

  const exportarCSV = () => {
    const headers = ['Código', 'Producto', 'Categoría', 'Stock', 'Stock Mínimo', 'Precio Compra', 'Precio Venta', 'Valor Total'];
    const rows = productosFiltrados.map(p => [
      p.codigo,
      p.nombre,
      p.categoria_nombre,
      p.stock,
      p.stock_minimo,
      parseFloat(p.precio_compra).toFixed(2),
      parseFloat(p.precio_venta).toFixed(2),
      (p.stock * parseFloat(p.precio_venta)).toFixed(2)
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventario_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const estadisticas = calcularEstadisticas();

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reporte de Inventario</h1>
          <p className="text-gray-600">Estado actual del inventario</p>
        </div>
        <button
          onClick={exportarCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Exportar CSV
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Productos</p>
              <p className="text-3xl font-bold text-gray-800">{estadisticas.totalProductos}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Stock Total</p>
              <p className="text-3xl font-bold text-green-600">{estadisticas.stockTotal}</p>
              <p className="text-xs text-gray-500">unidades</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Valor Inventario</p>
              <p className="text-3xl font-bold text-purple-600">
                Bs. {estadisticas.valorInventario.toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Stock Bajo</p>
              <p className="text-3xl font-bold text-red-600">{estadisticas.stockBajo}</p>
              <p className="text-xs text-gray-500">productos</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Ganancia potencial */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/90 text-sm mb-1">Ganancia Potencial del Inventario</p>
            <p className="text-4xl font-bold">Bs. {estadisticas.gananciaPotencial.toFixed(2)}</p>
            <p className="text-white/80 text-sm mt-2">
              Valor Venta: Bs. {estadisticas.valorInventario.toFixed(2)} - 
              Valor Compra: Bs. {estadisticas.valorCompra.toFixed(2)}
            </p>
          </div>
          <div className="text-6xl opacity-20">💰</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Categoría
            </label>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Stock
            </label>
            <select
              value={filtroStock}
              onChange={(e) => setFiltroStock(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="bajo">Solo Stock Bajo</option>
              <option value="normal">Solo Stock Normal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="font-semibold">Inventario Detallado</h3>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Categoría
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  P. Compra
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  P. Venta
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Valor Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productosFiltrados.map((producto) => {
                const stockBajo = producto.stock <= producto.stock_minimo;
                const valorTotal = producto.stock * parseFloat(producto.precio_venta);

                return (
                  <tr key={producto.id} className={`hover:bg-gray-50 ${stockBajo ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900">{producto.codigo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                      {stockBajo && (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <AlertTriangle className="w-3 h-3" />
                          Stock bajo
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {producto.categoria_nombre}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`font-semibold ${stockBajo ? 'text-red-600' : 'text-gray-900'}`}>
                        {producto.stock}
                      </div>
                      <div className="text-xs text-gray-500">mín: {producto.stock_minimo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                      Bs. {parseFloat(producto.precio_compra).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                      Bs. {parseFloat(producto.precio_venta).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-purple-600">
                      Bs. {valorTotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold">
              <tr>
                <td colSpan="6" className="px-6 py-4 text-right">
                  VALOR TOTAL DEL INVENTARIO:
                </td>
                <td className="px-6 py-4 text-right text-purple-600">
                  Bs. {estadisticas.valorInventario.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Análisis por categoría */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4">Análisis por Categoría</h3>
        <div className="space-y-3">
          {categorias.map(categoria => {
            const productosCat = productosFiltrados.filter(p => p.categoria_id === categoria.id);
            const valorCat = productosCat.reduce((sum, p) => sum + (p.stock * parseFloat(p.precio_venta)), 0);
            const porcentaje = estadisticas.valorInventario > 0 
              ? (valorCat / estadisticas.valorInventario * 100).toFixed(1) 
              : 0;

            return (
              <div key={categoria.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{categoria.nombre}</span>
                    <span className="text-sm text-gray-600">{porcentaje}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm text-gray-600">{productosCat.length} productos</div>
                  <div className="font-semibold text-purple-600">Bs. {valorCat.toFixed(2)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReporteInventario;