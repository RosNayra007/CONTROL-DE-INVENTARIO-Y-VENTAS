import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientesAPI } from '../../services/api';
import { ArrowLeft, Save, User, CreditCard, Phone, Mail, MapPin } from 'lucide-react';

const FormCliente = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = !!id;

  const [formData, setFormData] = useState({
    nit: '',
    nombre: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (esEdicion) {
      cargarCliente();
    }
  }, [id]);

  const cargarCliente = async () => {
    try {
      const response = await clientesAPI.obtener(id);
      if (response.data.ok) {
        const cliente = response.data.cliente;
        setFormData({
          nit: cliente.nit || '',
          nombre: cliente.nombre,
          telefono: cliente.telefono || '',
          email: cliente.email || '',
          direccion: cliente.direccion || ''
        });
      }
    } catch (error) {
      console.error('Error al cargar cliente:', error);
      alert('Error al cargar cliente');
      navigate('/clientes');
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

    // Validaciones básicas
    if (formData.nombre.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      setLoading(false);
      return;
    }

    try {
      let response;
      if (esEdicion) {
        response = await clientesAPI.actualizar(id, formData);
      } else {
        response = await clientesAPI.crear(formData);
      }

      if (response.data.ok) {
        alert(esEdicion ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente');
        navigate('/clientes');
      }
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      setError(error.response?.data?.mensaje || 'Error al guardar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/clientes')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {esEdicion ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h1>
          <p className="text-gray-600">
            {esEdicion ? 'Modifica los datos del cliente' : 'Completa la información del cliente'}
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
          {/* Nombre */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                minLength={3}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Juan Pérez García"
              />
            </div>
          </div>

          {/* NIT/CI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NIT/CI
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="nit"
                value={formData.nit}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1234567"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Opcional</p>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="70000000"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Opcional</p>
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="cliente@email.com"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Opcional</p>
          </div>

          {/* Dirección */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                rows={3}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Calle, número, zona, ciudad..."
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Opcional</p>
          </div>
        </div>

        {/* Vista previa */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Vista Previa</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700">Nombre</p>
              <p className="font-semibold text-blue-900">{formData.nombre || '-'}</p>
            </div>
            <div>
              <p className="text-blue-700">NIT/CI</p>
              <p className="font-semibold text-blue-900">{formData.nit || 'S/N'}</p>
            </div>
            <div>
              <p className="text-blue-700">Teléfono</p>
              <p className="font-semibold text-blue-900">{formData.telefono || 'No registrado'}</p>
            </div>
            <div>
              <p className="text-blue-700">Email</p>
              <p className="font-semibold text-blue-900">{formData.email || 'No registrado'}</p>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Información</h4>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>El nombre es obligatorio (mínimo 3 caracteres)</li>
            <li>El NIT/CI debe ser único en el sistema</li>
            <li>Los demás campos son opcionales pero recomendados</li>
            <li>Puedes agregar la información de contacto después</li>
          </ul>
        </div>

        {/* Botones */}
        <div className="flex gap-4 justify-end pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/clientes')}
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
                {esEdicion ? 'Actualizar' : 'Guardar'} Cliente
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormCliente;