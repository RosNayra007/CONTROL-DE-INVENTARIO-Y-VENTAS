import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Colores para gráficos
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Gráfico de líneas para ventas por mes
export const VentasPorMesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <EmptyChart message="No hay datos de ventas disponibles" />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mesNombre" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`Bs. ${value.toFixed(2)}`, 'Total']}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="total" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="Total Bs."
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Gráfico de área para ventas diarias
export const VentasDiariasChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <EmptyChart message="No hay datos de ventas diarias" />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fechaCorta" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`Bs. ${value.toFixed(2)}`, 'Total']}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="total" 
          stroke="#10b981" 
          fill="#10b981" 
          fillOpacity={0.6}
          name="Total Bs."
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Gráfico de barras para productos más vendidos
export const ProductosTopChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <EmptyChart message="No hay productos vendidos" />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="nombre" 
          angle={-45}
          textAnchor="end"
          height={100}
        />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => {
            if (name === 'cantidadVendida') return [value, 'Unidades'];
            return [`Bs. ${value.toFixed(2)}`, 'Total'];
          }}
        />
        <Legend />
        <Bar 
          dataKey="cantidadVendida" 
          fill="#10b981" 
          name="Unidades Vendidas"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Gráfico circular para ventas por categoría
export const VentasPorCategoriaChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <EmptyChart message="No hay ventas por categoría" />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="totalVendido"
          nameKey="categoria"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ categoria, percent }) => 
            `${categoria} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => `Bs. ${value.toFixed(2)}`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Gráfico de barras para inventario por categoría
export const InventarioPorCategoriaChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <EmptyChart message="No hay datos de inventario" />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="categoria" type="category" width={100} />
        <Tooltip 
          formatter={(value, name) => {
            if (name === 'stockTotal') return [value, 'Unidades'];
            if (name === 'cantidadProductos') return [value, 'Productos'];
            return [`Bs. ${value.toFixed(2)}`, 'Valor'];
          }}
        />
        <Legend />
        <Bar 
          dataKey="cantidadProductos" 
          fill="#3b82f6" 
          name="Productos"
          radius={[0, 8, 8, 0]}
        />
        <Bar 
          dataKey="stockTotal" 
          fill="#10b981" 
          name="Stock Total"
          radius={[0, 8, 8, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Componente para mostrar cuando no hay datos
const EmptyChart = ({ message }) => (
  <div className="flex items-center justify-center h-[300px]">
    <div className="text-center text-gray-500">
      <svg 
        className="w-16 h-16 mx-auto mb-2 text-gray-300"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
        />
      </svg>
      <p>{message}</p>
    </div>
  </div>
);

export default {
  VentasPorMesChart,
  VentasDiariasChart,
  ProductosTopChart,
  VentasPorCategoriaChart,
  InventarioPorCategoriaChart
};