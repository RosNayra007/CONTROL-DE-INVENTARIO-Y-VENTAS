import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import { 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingCart,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    estadisticas: null,
    graficos: null
  });

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      const response = await dashboardAPI.obtener();
      if (response.data.ok) {
        setData({
          estadisticas: response.data.estadisticas,
          graficos: response.data.graficos
        });
      }
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
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

  const { estadisticas, graficos } = data;

  // Colores para gráficos
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Resumen general del sistema</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Productos"
          value={estadisticas?.totalProductos || 0}
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="Total Clientes"
          value={estadisticas?.totalClientes || 0}
          icon={Users}
          color="green"
        />
        <StatsCard
          title="Ventas del Día"
          value={`Bs. ${estadisticas?.ventasHoy?.monto?.toFixed(2) || '0.00'}`}
          subtitle={`${estadisticas?.ventasHoy?.cantidad || 0} ventas`}
          icon={ShoppingCart}
          color="purple"
        />
        <StatsCard
          title="Ventas del Mes"
          value={`Bs. ${estadisticas?.ventasMes?.monto?.toFixed(2) || '0.00'}`}
          subtitle={`${estadisticas?.ventasMes?.cantidad || 0} ventas`}
          icon={DollarSign}
          color="yellow"
        />
      </div>

      {/* Alerta de stock bajo */}
      {estadisticas?.productosStockBajo > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <p className="font-semibold text-yellow-800">
                ¡Atención! Productos con stock bajo
              </p>
              <p className="text-yellow-700">
                Hay {estadisticas.productosStockBajo} productos con stock por debajo del mínimo
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por mes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Ventas por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graficos?.ventasPorMes || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mesNombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Total Bs."
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Productos más vendidos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Productos Más Vendidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graficos?.productosMasVendidos || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidadVendida" fill="#10b981" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ventas por categoría */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Ventas por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={graficos?.ventasPorCategoria || []}
                dataKey="totalVendido"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {(graficos?.ventasPorCategoria || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Resumen rápido */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Resumen Rápido</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Total de Ventas</span>
              <span className="font-bold text-blue-600">
                {estadisticas?.totalVentas || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Promedio por Venta</span>
              <span className="font-bold text-green-600">
                Bs. {estadisticas?.ventasMes?.cantidad > 0 
                  ? (estadisticas.ventasMes.monto / estadisticas.ventasMes.cantidad).toFixed(2)
                  : '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700">Productos Activos</span>
              <span className="font-bold text-purple-600">
                {estadisticas?.totalProductos || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-700">Clientes Registrados</span>
              <span className="font-bold text-yellow-600">
                {estadisticas?.totalClientes || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de tarjeta de estadísticas
const StatsCard = ({ title, value, subtitle, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-full ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;