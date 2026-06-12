import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Users,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Eye
} from 'lucide-react';

const ListaClientes = () => {
  const navigate = useNavigate();
  const { esAdmin } = useAuth();
  
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const response = await clientesAPI.listar();
      if (response.data.ok) {
        setClientes(response.data.clientes);
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      alert('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (!esAdmin()) {
      alert('Solo los administradores pueden eliminar clientes');
      return;
    }

    if (!window.confirm(`¿Estás seguro de eliminar el cliente "${nombre}"?`)) {
      return;
    }

    try {
      const response = await clientesAPI.eliminar(id);
      if (response.data.ok) {
        alert('Cliente eliminado exitosamente');
        cargarClientes();
      }
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      alert('Error al eliminar cliente');
    }
  };

  // Filtrar clientes
  const clientesFiltrados = clientes.filter(cliente => {
    const busquedaLower = busqueda.toLowerCase();
    return (
      cliente.nombre.toLowerCase().includes(busquedaLower) ||
      (cliente.nit && cliente.nit.toLowerCase().includes(busquedaLower)) ||
      (cliente.email && cliente.email.toLowerCase().includes(busquedaLower)) ||
      (cliente.telefono && cliente.telefono.includes(busqueda))
    );
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
          <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-600">Gestión de clientes registrados</p>
        </div>
        <button
          onClick={() => navigate('/clientes/nuevo')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Cliente
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, NIT, email o teléfono..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={cargarClientes}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-5 h-5" />
            Actualizar
          </button>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">
              Total: <strong>{clientesFiltrados.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIT/CI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No se encontraron clientes</p>
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {cliente.nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {cliente.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900">
                        {cliente.nit || 'S/N'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {cliente.telefono && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {cliente.telefono}
                          </div>
                        )}
                        {cliente.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            {cliente.email}
                          </div>
                        )}
                        {!cliente.telefono && !cliente.email && (
                          <span className="text-sm text-gray-400">Sin contacto</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {cliente.direccion ? (
                        <div className="flex items-start gap-2 text-sm text-gray-600 max-w-xs">
                          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{cliente.direccion}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Sin dirección</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/clientes/${cliente.id}`)}
                          className="text-green-600 hover:text-green-900"
                          title="Ver detalle"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        {esAdmin() && (
                          <button
                            onClick={() => handleEliminar(cliente.id, cliente.nombre)}
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
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-gray-600 text-sm">Total Clientes</p>
            <p className="text-3xl font-bold text-gray-800">
              {clientesFiltrados.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Con Email</p>
            <p className="text-3xl font-bold text-blue-600">
              {clientesFiltrados.filter(c => c.email).length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Con Teléfono</p>
            <p className="text-3xl font-bold text-green-600">
              {clientesFiltrados.filter(c => c.telefono).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaClientes;