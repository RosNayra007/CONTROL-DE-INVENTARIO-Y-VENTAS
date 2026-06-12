import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productosAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  AlertTriangle,
  Package,
  RefreshCw
} from 'lucide-react';

const ListaProductos = () => {
  const navigate = useNavigate();
  const { esAdmin } = useAuth();
  
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await productosAPI.listar();
      if (response.data.ok) {
        setProductos(response.data.productos);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await productosAPI.categorias();
      if (response.data.ok) {
        setCategorias(response.data.categorias);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (!esAdmin()) {
      alert('Solo los administradores pueden eliminar productos');
      return;
    }

    if (!window.confirm(`¿Estás seguro de eliminar el producto "${nombre}"?`)) {
      return;
    }

    try {
      const response = await productosAPI.eliminar(id);
      if (response.data.ok) {
        alert('Producto eliminado exitosamente');
        cargarProductos();
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar producto');
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const cumpleBusqueda = 
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(busqueda.toLowerCase());
    
    const cumpleCategoria = 
      categoriaFiltro === '' || 
      producto.categoria_id === parseInt(categoriaFiltro);
    
    return cumpleBusqueda && cumpleCategoria;
  });

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
          <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
          <p className="text-gray-600">Gestión de inventario</p>
        </div>
        <button
          onClick={() => navigate('/productos/nuevo')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por categoría */}
          <div>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="flex gap-4 mt-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">
              Total: <strong>{productosFiltrados.length}</strong>
            </span>
          </div>
          <button
            onClick={cargarProductos}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No se encontraron productos</p>
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900">
                        {producto.codigo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {producto.nombre}
                        </div>
                        {producto.descripcion && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {producto.descripcion}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {producto.categoria_nombre || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        Bs. {parseFloat(producto.precio_compra).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-green-600">
                        Bs. {parseFloat(producto.precio_venta).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${
                          producto.stock <= producto.stock_minimo 
                            ? 'text-red-600' 
                            : 'text-gray-900'
                        }`}>
                          {producto.stock}
                        </span>
                        {producto.stock <= producto.stock_minimo && (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Mín: {producto.stock_minimo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        producto.stock > producto.stock_minimo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {producto.stock > producto.stock_minimo ? 'Disponible' : 'Stock Bajo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/productos/editar/${producto.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        {esAdmin() && (
                          <button
                            onClick={() => handleEliminar(producto.id, producto.nombre)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
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

      {/* Resumen */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm">Productos mostrados</p>
            <p className="text-2xl font-bold text-gray-800">
              {productosFiltrados.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Valor total inventario</p>
            <p className="text-2xl font-bold text-green-600">
              Bs. {productosFiltrados
                .reduce((sum, p) => sum + (p.stock * parseFloat(p.precio_venta)), 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Productos con stock bajo</p>
            <p className="text-2xl font-bold text-red-600">
              {productosFiltrados.filter(p => p.stock <= p.stock_minimo).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaProductos;