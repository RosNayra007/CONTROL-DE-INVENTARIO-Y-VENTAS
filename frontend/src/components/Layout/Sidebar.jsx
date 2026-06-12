import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FileText,
  BarChart3,
  PlusCircle
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { esAdmin, usuario } = useAuth();

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'vendedor', 'almacen']
    },
    {
      title: 'Productos',
      path: '/productos',
      icon: Package,
      roles: ['admin', 'vendedor', 'almacen']
    },
    {
      title: 'Clientes',
      path: '/clientes',
      icon: Users,
      roles: ['admin', 'vendedor']
    },
    {
      title: 'Ventas',
      path: '/ventas',
      icon: ShoppingCart,
      roles: ['admin', 'vendedor']
    },
    {
      title: 'Reportes',
      path: '/reportes',
      icon: FileText,
      roles: ['admin']
    },
    {
      title: 'Estadísticas',
      path: '/estadisticas',
      icon: BarChart3,
      roles: ['admin']
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const puedeVerItem = (roles) => {
    return roles.includes(usuario?.rol);
  };

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-transform duration-300 z-20
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64`}
      >
        <div className="p-4 h-full overflow-y-auto flex flex-col">
          {/* Menú principal */}
          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => {
              if (!puedeVerItem(item.roles)) return null;
              
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Acciones rápidas */}
          {(usuario?.rol === 'vendedor' || usuario?.rol === 'admin') && (
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <Link
                to="/ventas/nueva"
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Nueva Venta</span>
              </Link>
            </div>
          )}

          {/* Footer del sidebar */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-semibold text-gray-700 mb-1">
                {usuario?.nombre}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                Rol: {usuario?.rol}
              </p>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              Sistema de Inventario v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;