import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productosAPI } from '../../services/api';
import { 
  ArrowLeft, 
  Edit, 
  Package, 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  Tag,
  Calendar
} from 'lucide-react';

const DetalleProducto = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProducto();
  }, [id]);

  const cargarProducto = async () => {
    try {
      const response = await productosAPI.obtener(id);
      if (response.data.ok) {
        setProducto(response.data.producto);
      }
    } catch (error) {
      console.error('Error al cargar producto:', error);
      alert('Error al cargar producto');
      navigate('/productos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Producto no encontrado</p>
      </div>
    );
  }

  const ganancia = parseFloat(producto.precio_venta) - parseFloat(producto.precio_compra);
  const margen = (ganancia / parseFloat(producto.precio_compra) * 100).toFixed(1);
  const valorInventario = producto.stock * parseFloat(producto.precio_venta);
  const stockBajo = producto.stock <= producto.stock_minimo;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/productos')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Detalle del Producto</h1>
            <p className="text-gray-600">Información completa</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/productos/editar/${id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Edit className="w-5 h-5" />
          Editar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información básica */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-mono rounded">
                    {producto.codigo}
                  </span>
                  <span className={`px-3 py-1 text-sm font-semibold rounded ${
                    stockBajo 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {stockBajo ? 'Stock Bajo' : 'Disponible'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {producto.nombre}
                </h2>
                {producto.descripcion && (
                  <p className="text-gray-600">{producto.descripcion}</p>
                )}
              </div>
            </div>

            {/* Detalles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm">Categoría</span>
                </div>
                <p className="font-semibold text-gray-800">
                  {producto.categoria_nombre || 'Sin categoría'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Fecha de registro</span>
                </div>
                <p className="font-semibold text-gray-800">
                  {new Date(producto.created_at).toLocaleDateString('es-BO')}
                </p>
              </div>
            </div>
          </div>

          {/* Precios y márgenes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Información de Precios
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border-2 border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Precio de Compra</p>
                <p className="text-2xl font-bold text-gray-800">
                  Bs. {parseFloat(producto.precio_compra).toFixed(2)}
                </p>
              </div>

              <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Precio de Venta</p>
                <p className="text-2xl font-bold text-green-700">
                  Bs. {parseFloat(producto.precio_venta).toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Ganancia por Unidad</p>
                <p className="text-xl font-bold text-blue-700">
                  Bs. {ganancia.toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Margen de Ganancia</p>
                <p className="text-xl font-bold text-purple-700 flex items-center gap-1">
                  <TrendingUp className="w-5 h-5" />
                  {margen}%
                </p>
              </div>
            </div>
          </div>

          {/* Stock e inventario */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Control de Stock
            </h3>

            <div className="space-y-4">
              {/* Barra de stock */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Stock Actual</span>
                  <span className="text-sm font-semibold">
                    {producto.stock} / {producto.stock + producto.stock_minimo} unidades
                  </span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      stockBajo ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min((producto.stock / (producto.stock + producto.stock_minimo)) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>

              {/* Alertas */}
              {stockBajo && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">
                      ¡Stock por debajo del mínimo!
                    </p>
                    <p className="text-sm text-red-700">
                      Se recomienda reabastecer. Stock mínimo: {producto.stock_minimo} unidades
                    </p>
                  </div>
                </div>
              )}

              {/* Detalles de stock */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Stock Actual</p>
                  <p className="text-2xl font-bold text-gray-800">{producto.stock}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Stock Mínimo</p>
                  <p className="text-2xl font-bold text-gray-800">{producto.stock_minimo}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">A Reponer</p>
                  <p className="text-2xl font-bold text-red-600">
                    {Math.max(0, producto.stock_minimo - producto.stock)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Resumen */}
        <div className="space-y-6">
          {/* Valor total */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Valor Total en Inventario</p>
            <p className="text-4xl font-bold mb-1">
              Bs. {valorInventario.toFixed(2)}
            </p>
            <p className="text-sm opacity-75">
              {producto.stock} unidades × Bs. {parseFloat(producto.precio_venta).toFixed(2)}
            </p>
          </div>

          {/* Estadísticas rápidas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Resumen Rápido</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Código</span>
                <span className="font-mono font-semibold">{producto.codigo}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Categoría</span>
                <span className="font-semibold">{producto.categoria_nombre}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Estado</span>
                <span className={`font-semibold ${stockBajo ? 'text-red-600' : 'text-green-600'}`}>
                  {stockBajo ? 'Stock Bajo' : 'Disponible'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Última Act.</span>
                <span className="font-semibold text-sm">
                  {new Date(producto.updated_at).toLocaleDateString('es-BO')}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/productos/editar/${id}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar Producto
              </button>
              <button
                onClick={() => navigate('/ventas/nueva')}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" />
                Vender Producto
              </button>
              <button
                onClick={() => navigate('/productos')}
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

export default DetalleProducto;