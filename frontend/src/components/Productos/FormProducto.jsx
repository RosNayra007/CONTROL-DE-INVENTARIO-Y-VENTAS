import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productosAPI } from '../../services/api';
import { ArrowLeft, Save, Package } from 'lucide-react';

const FormProducto = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = !!id;

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria_id: '',
    precio_compra: '',
    precio_venta: '',
    stock: '',
    stock_minimo: '5',
    imagen: ''
  });

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarCategorias();
    if (esEdicion) {
      cargarProducto();
    }
  }, [id]);

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

  const cargarProducto = async () => {
    try {
      const response = await productosAPI.obtener(id);
      if (response.data.ok) {
        const producto = response.data.producto;
        setFormData({
          codigo: producto.codigo,
          nombre: producto.nombre,
          descripcion: producto.descripcion || '',
          categoria_id: producto.categoria_id,
          precio_compra: producto.precio_compra,
          precio_venta: producto.precio_venta,
          stock: producto.stock,
          stock_minimo: producto.stock_minimo,
          imagen: producto.imagen || ''
        });
      }
    } catch (error) {
      console.error('Error al cargar producto:', error);
      alert('Error al cargar producto');
      navigate('/productos');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (parseFloat(formData.precio_venta) < parseFloat(formData.precio_compra)) {
      setError('El precio de venta debe ser mayor al precio de compra');
      setLoading(false);
      return;
    }

    if (parseInt(formData.stock) < 0) {
      setError('El stock no puede ser negativo');
      setLoading(false);
      return;
    }

    try {
      let response;
      if (esEdicion) {
        response = await productosAPI.actualizar(id, formData);
      } else {
        response = await productosAPI.crear(formData);
      }

      if (response.data.ok) {
        alert(esEdicion ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
        navigate('/productos');
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setError(error.response?.data?.mensaje || 'Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/productos')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {esEdicion ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
          <p className="text-gray-600">
            {esEdicion ? 'Modifica los datos del producto' : 'Completa la información del producto'}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Grid de campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="PROD001"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              minLength={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Laptop HP 15 pulgadas"
            />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción detallada del producto..."
            />
          </div>

          {/* Precio Compra */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio de Compra (Bs.) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="precio_compra"
              value={formData.precio_compra}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="100.00"
            />
          </div>

          {/* Precio Venta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio de Venta (Bs.) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="precio_venta"
              value={formData.precio_venta}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="150.00"
            />
            {formData.precio_compra && formData.precio_venta && (
              <p className="text-sm text-gray-600 mt-1">
                Ganancia: Bs. {(parseFloat(formData.precio_venta) - parseFloat(formData.precio_compra)).toFixed(2)} 
                {' '}({((parseFloat(formData.precio_venta) - parseFloat(formData.precio_compra)) / parseFloat(formData.precio_compra) * 100).toFixed(1)}%)
              </p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Actual <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50"
            />
          </div>

          {/* Stock Mínimo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Mínimo <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock_minimo"
              value={formData.stock_minimo}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5"
            />
            <p className="text-sm text-gray-600 mt-1">
              Se mostrará alerta cuando el stock llegue a este nivel
            </p>
          </div>

          {/* URL Imagen */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de Imagen (opcional)
            </label>
            <input
              type="text"
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
        </div>

        {/* Vista previa de valores */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Vista Previa</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Código</p>
              <p className="font-semibold">{formData.codigo || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600">Nombre</p>
              <p className="font-semibold">{formData.nombre || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600">Stock</p>
              <p className="font-semibold">{formData.stock || '0'} unidades</p>
            </div>
            <div>
              <p className="text-gray-600">Valor Inventario</p>
              <p className="font-semibold text-green-600">
                Bs. {((formData.stock || 0) * (formData.precio_venta || 0)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate('/productos')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              'Guardando...'
            ) : (
              <>
                <Save className="w-5 h-5" />
                {esEdicion ? 'Actualizar' : 'Guardar'} Producto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormProducto;