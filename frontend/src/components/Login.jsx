import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Lock, Mail, RefreshCw, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captchaText: ''
  });
  
  const [captcha, setCaptcha] = useState({
    id: '',
    svg: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Cargar CAPTCHA al montar componente
  useEffect(() => {
    cargarCaptcha();
  }, []);

  // Función para cargar CAPTCHA
  const cargarCaptcha = async () => {
    try {
      const response = await authAPI.generarCaptcha();
      if (response.data.ok) {
        setCaptcha({
          id: response.data.captchaId,
          svg: response.data.captchaSvg
        });
        setFormData(prev => ({ ...prev, captchaText: '' }));
      }
    } catch (error) {
      console.error('Error al cargar CAPTCHA:', error);
      setError('Error al cargar CAPTCHA');
    }
  };

  // Manejar cambios en inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Manejar submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(
      formData.email,
      formData.password,
      captcha.id,
      formData.captchaText
    );

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      cargarCaptcha(); // Recargar CAPTCHA si falla
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido</h1>
          <p className="text-gray-600 mt-2">Sistema de Inventario y Ventas</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
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
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ejemplo@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* CAPTCHA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código de verificación
            </label>
            <div className="flex gap-3 items-start">
              <div 
                className="bg-gray-100 p-3 rounded-lg flex-shrink-0"
                dangerouslySetInnerHTML={{ __html: captcha.svg }}
              />
              <button
                type="button"
                onClick={cargarCaptcha}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Recargar CAPTCHA"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              name="captchaText"
              value={formData.captchaText}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa el código"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-blue-600 hover:text-blue-700 font-semibold">
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Credenciales de prueba */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center font-semibold mb-2">
            Credenciales de prueba:
          </p>
          <p className="text-xs text-gray-500 text-center">
            Email: admin@tienda.com
          </p>
          <p className="text-xs text-gray-500 text-center">
            Password: Admin123!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;