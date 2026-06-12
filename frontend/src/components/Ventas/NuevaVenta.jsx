import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ventasAPI, productosAPI, clientesAPI } from '../../services/api';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  AlertCircle,
  Search
} from 'lucide-react';

const NuevaVenta = () => {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [productosVenta, setProductosVenta] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busquedaProducto, setBusquedaProducto] = useState('');

  useEffect(() => {
    cargarClientes();
    cargarProductos();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await clientesAPI.listar();
      if (response.data.ok) {
        setClientes(response.data.clientes);
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const cargarProductos = async () => {
    try {
      const response = await productosAPI.listar();
      if (response.data.ok) {
        setProductos(response.data.productos.filter(p => p.stock > 0));
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const agregarProducto = (producto) => {
    // Verificar si ya está en la venta
    const existe = productosVenta.find(p => p.producto_id === producto.id);
    
    if (existe) {
      // Incrementar cantidad si hay stock disponible
      if (existe.cantidad < producto.stock) {
        setProductosVenta(productosVenta.map(p => 
          p.producto_id === producto.id 
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        ));
      } else {
        alert('No hay suficiente stock disponible');
      }
    } else {
      // Agregar nuevo producto
      setProductosVenta([
        ...productosVenta,
        {
          producto_id: producto.id,
          nombre: producto.nombre,
          codigo: producto.codigo,
          precio_unitario: parseFloat(producto.precio_venta),
          cantidad: 1,
          stock_disponible: producto.stock
        }
      ]);
    }
    
    setBusquedaProducto('');
  };

  const modificarCantidad = (producto_id, nuevaCantidad) => {
    const producto = productosVenta.find(p => p.producto_id === producto_id);
    
    if (nuevaCantidad <= 0) {
      eliminarProducto(producto_id);
      return;
    }
    
    if (nuevaCantidad > producto.stock_disponible) {
      alert('No hay suficiente stock disponible');
      return;
    }
    
    setProductosVenta(productosVenta.map(p =>
      p.producto_id === producto_id
        ? { ...p, cantidad: nuevaCantidad }
        : p
    ));
  };

  const eliminarProducto = (producto_id) => {
    setProductosVenta(productosVenta.filter(p => p.producto_id !== producto_id));
  };

  const calcularSubtotal = () => {
    return productosVenta.reduce((sum, p) => sum + (p.cantidad * p.precio_unitario), 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal() - descuento;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (!clienteSeleccionado) {
      setError('Debes seleccionar un cliente');
      setLoading(false);
      return;
    }

    if (productosVenta.length === 0) {
      setError('Debes agregar al menos un producto');
      setLoading(false);
      return;
    }

    if (descuento > calcularSubtotal()) {
      setError('El descuento no puede ser mayor al subtotal');
      setLoading(false);
      return;
    }

    try {
      const datos = {
        cliente_id: parseInt(clienteSeleccionado),
        descuento: parseFloat(descuento),
        productos: productosVenta
      };

      const response = await ventasAPI.crear(datos);

      if (response.data.ok) {
        alert('Venta registrada exitosamente');
        navigate('/ventas');
      }
    } catch (error) {
      console.error('Error al registrar venta:', error);
      setError(error.response?.data?.mensaje || 'Error al registrar venta');
      
      // Mostrar detalles de productos sin stock
      if (error.response?.data?.productosInvalidos) {
        const detalles = error.response.data.productosInvalidos
          .map(p => `Producto ID ${p.producto_id}: Stock disponible ${p.disponible}, solicitado ${p.solicitado}`)
          .join('\n');
        setError(`${error.response.data.mensaje}\n\n${detalles}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos para búsqueda
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    p.codigo.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/ventas')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Nueva Venta</h1>
          <p className="text-gray-600">Registra una nueva venta</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <pre className="text-sm whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Productos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Búsqueda de productos */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Agregar Productos</h2>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar producto por nombre o código..."
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {busquedaProducto && (
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                  {productosFiltrados.length === 0 ? (
                    <p className="p-4 text-gray-500 text-center">No se encontraron productos</p>
                  ) : (
                    productosFiltrados.slice(0, 5).map(producto => (
                      <button
                        key={producto.id}
                        type="button"
                        onClick={() => agregarProducto(producto)}
                        className="w-full p-3 hover:bg-gray-50 flex justify-between items-center border-b last:border-b-0"
                      >
                        <div className="text-left">
                          <p className="font-medium">{producto.nombre}</p>
                          <p className="text-sm text-gray-500">
                            {producto.codigo} - Stock: {producto.stock}
                          </p>
                        </div>
                        <span className="text-green-600 font-semibold">
                          Bs. {parseFloat(producto.precio_venta).toFixed(2)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Lista de productos en la venta */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Productos en la Venta</h2>
                
                {productosVenta.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No hay productos agregados</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                            Producto
                          </th>
                          <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                            Precio
                          </th>
                          <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                            Cantidad
                          </th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                            Subtotal
                          </th>
                          <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                            Acción
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {productosVenta.map(producto => (
                          <tr key={producto.producto_id}>
                            <td className="px-4 py-3">
                              <p className="font-medium">{producto.nombre}</p>
                              <p className="text-sm text-gray-500">{producto.codigo}</p>
                            </td>
                            <td className="px-4 py-3 text-center">
                              Bs. {producto.precio_unitario.toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => modificarCantidad(producto.producto_id, producto.cantidad - 1)}
                                  className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={producto.cantidad}
                                  onChange={(e) => modificarCantidad(producto.producto_id, parseInt(e.target.value) || 0)}
                                  className="w-16 text-center border border-gray-300 rounded"
                                  min="1"
                                  max={producto.stock_disponible}
                                />
                                <button
                                  type="button"
                                  onClick={() => modificarCantidad(producto.producto_id, producto.cantidad + 1)}
                                  className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded"
                                >
                                  +
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 text-center mt-1">
                                Stock: {producto.stock_disponible}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-right font-semibold">
                              Bs. {(producto.cantidad * producto.precio_unitario).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => eliminarProducto(producto.producto_id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha - Cliente y Totales */}
          <div className="space-y-6">
            {/* Cliente */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Cliente</h2>
              <select
                value={clienteSeleccionado}
                onChange={(e) => setClienteSeleccionado(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} - {cliente.nit || 'S/N'}
                  </option>
                ))}
              </select>
            </div>

            {/* Resumen */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Resumen</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">Bs. {calcularSubtotal().toFixed(2)}</span>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Descuento:</label>
                  <input
                    type="number"
                    value={descuento}
                    onChange={(e) => setDescuento(parseFloat(e.target.value) || 0)}
                    min="0"
                    max={calcularSubtotal()}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      Bs. {calcularTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-500 space-y-1">
                  <p>Productos: {productosVenta.length}</p>
                  <p>Unidades: {productosVenta.reduce((sum, p) => sum + p.cantidad, 0)}</p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || productosVenta.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Procesando...'
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Registrar Venta
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/ventas')}
                className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NuevaVenta;