import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTENTICACIÓN ====================

export const authAPI = {
  // Generar CAPTCHA
  generarCaptcha: () => api.get('/auth/captcha'),
  
  // Login
  login: (datos) => api.post('/auth/login', datos),
  
  // Registro
  registro: (datos) => api.post('/auth/registro', datos),
  
  // Logout
  logout: () => api.post('/auth/logout'),
  
  // Validar contraseña
  validarPassword: (password) => api.post('/auth/validar-password', { password }),
  
  // Obtener logs
  obtenerLogs: () => api.get('/auth/logs'),
  
  // Obtener mis logs
  obtenerMisLogs: () => api.get('/auth/mis-logs')
};

// ==================== PRODUCTOS ====================

export const productosAPI = {
  // Listar todos
  listar: () => api.get('/productos'),
  
  // Obtener por ID
  obtener: (id) => api.get(`/productos/${id}`),
  
  // Crear
  crear: (datos) => api.post('/productos', datos),
  
  // Actualizar
  actualizar: (id, datos) => api.put(`/productos/${id}`, datos),
  
  // Eliminar (lógico)
  eliminar: (id) => api.delete(`/productos/${id}`),
  
  // Restaurar
  restaurar: (id) => api.patch(`/productos/${id}/restaurar`),
  
  // Stock bajo
  stockBajo: () => api.get('/productos/stock-bajo'),
  
  // Categorías
  categorias: () => api.get('/productos/categorias')
};

// ==================== CLIENTES ====================

export const clientesAPI = {
  // Listar todos
  listar: () => api.get('/clientes'),
  
  // Obtener por ID
  obtener: (id) => api.get(`/clientes/${id}`),
  
  // Crear
  crear: (datos) => api.post('/clientes', datos),
  
  // Actualizar
  actualizar: (id, datos) => api.put(`/clientes/${id}`, datos),
  
  // Eliminar (lógico)
  eliminar: (id) => api.delete(`/clientes/${id}`)
};

// ==================== VENTAS ====================

export const ventasAPI = {
  // Listar todas
  listar: () => api.get('/ventas'),
  
  // Obtener por ID
  obtener: (id) => api.get(`/ventas/${id}`),
  
  // Crear venta
  crear: (datos) => api.post('/ventas', datos),
  
  // Anular venta
  anular: (id) => api.delete(`/ventas/${id}`),
  
  // Ventas del día
  hoy: () => api.get('/ventas/hoy'),
  
  // Ventas por fecha
  porFecha: (fecha_inicio, fecha_fin) => 
    api.get('/ventas/por-fecha', { params: { fecha_inicio, fecha_fin } }),
  
  // Ventas por cliente
  porCliente: (cliente_id) => api.get(`/ventas/cliente/${cliente_id}`),
  
  // Verificar stock
  verificarStock: (producto_id, cantidad) => 
    api.get('/ventas/verificar-stock', { params: { producto_id, cantidad } })
};

// ==================== DASHBOARD ====================

export const dashboardAPI = {
  // Dashboard completo
  obtener: () => api.get('/dashboard'),
  
  // Estadísticas
  estadisticas: () => api.get('/dashboard/estadisticas'),
  
  // Gráficos
  ventasPorMes: () => api.get('/dashboard/graficos/ventas-mes'),
  ventasDiarias: () => api.get('/dashboard/graficos/ventas-diarias'),
  productosTop: (limite = 10) => 
    api.get('/dashboard/graficos/productos-top', { params: { limite } }),
  ventasPorCategoria: () => api.get('/dashboard/graficos/ventas-categoria'),
  inventario: () => api.get('/dashboard/graficos/inventario'),
  
  // Clientes top
  clientesTop: (limite = 10) => 
    api.get('/dashboard/clientes-top', { params: { limite } })
};

// ==================== REPORTES ====================

export const reportesAPI = {
  // Factura (devuelve URL)
  factura: (id) => ({
    ver: `http://localhost:3001/api/reportes/factura/${id}/ver`,
    descargar: `http://localhost:3001/api/reportes/factura/${id}/descargar`
  }),
  
  // Reporte de ventas (devuelve URL)
  ventas: (fecha_inicio, fecha_fin) => ({
    ver: `http://localhost:3001/api/reportes/ventas/ver?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`,
    descargar: `http://localhost:3001/api/reportes/ventas/descargar?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`
  })
};

export default api;