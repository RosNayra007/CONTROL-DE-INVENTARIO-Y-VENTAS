import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ListaProductos from './components/Productos/ListaProductos';
import FormProducto from './components/Productos/FormProducto';
import DetalleProducto from './components/Productos/DetalleProducto';
import NuevaVenta from './components/Ventas/NuevaVenta';
import ListaVentas from './components/Ventas/ListaVentas';
import DetalleVenta from './components/Ventas/DetalleVenta';
import ListaClientes from './components/Clientes/ListaClientes';
import FormCliente from './components/Clientes/FormCliente';
import ReporteVentas from './components/Reportes/ReporteVentas';
import ReporteInventario from './components/Reportes/ReporteInventario';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* Rutas protegidas */}
          <Route path="/dashboard" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />

          {/* Productos */}
          <Route path="/productos" element={
            <Layout>
              <ListaProductos />
            </Layout>
          } />
          <Route path="/productos/nuevo" element={
            <Layout>
              <FormProducto />
            </Layout>
          } />
          <Route path="/productos/editar/:id" element={
            <Layout>
              <FormProducto />
            </Layout>
          } />
          <Route path="/productos/:id" element={
            <Layout>
              <DetalleProducto />
            </Layout>
          } />

          {/* Ventas */}
          <Route path="/ventas" element={
            <Layout>
              <ListaVentas />
            </Layout>
          } />
          <Route path="/ventas/nueva" element={
            <Layout>
              <NuevaVenta />
            </Layout>
          } />
          <Route path="/ventas/:id" element={
            <Layout>
              <DetalleVenta />
            </Layout>
          } />

          {/* Clientes */}
          <Route path="/clientes" element={
            <Layout>
              <ListaClientes />
            </Layout>
          } />
          <Route path="/clientes/nuevo" element={
            <Layout>
              <FormCliente />
            </Layout>
          } />
          <Route path="/clientes/editar/:id" element={
            <Layout>
              <FormCliente />
            </Layout>
          } />

          {/* Reportes */}
          <Route path="/reportes" element={
            <Layout>
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">Reportes</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => window.location.href = '/reportes/ventas'}
                    className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow text-left"
                  >
                    <h3 className="text-xl font-semibold mb-2">Reporte de Ventas</h3>
                    <p className="text-gray-600">Genera reportes de ventas por período en PDF</p>
                  </button>
                  <button
                    onClick={() => window.location.href = '/reportes/inventario'}
                    className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow text-left"
                  >
                    <h3 className="text-xl font-semibold mb-2">Reporte de Inventario</h3>
                    <p className="text-gray-600">Visualiza el estado actual del inventario</p>
                  </button>
                </div>
              </div>
            </Layout>
          } />
          <Route path="/reportes/ventas" element={
            <Layout>
              <ReporteVentas />
            </Layout>
          } />
          <Route path="/reportes/inventario" element={
            <Layout>
              <ReporteInventario />
            </Layout>
          } />

          {/* Estadísticas */}
          <Route path="/estadisticas" element={
            <Layout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Estadísticas</h2>
                <p className="text-gray-600">Componente en desarrollo</p>
              </div>
            </Layout>
          } />

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600 mb-4">Página no encontrada</p>
                <a href="/dashboard" className="text-blue-600 hover:text-blue-700">
                  Volver al Dashboard
                </a>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;