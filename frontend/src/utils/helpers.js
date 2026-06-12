// ==================== FORMATOS ====================

/**
 * Formatea un número a moneda boliviana
 * @param {number} valor - Valor numérico
 * @returns {string} Formato: Bs. 1,234.56
 */
export const formatearMoneda = (valor) => {
  return `Bs. ${parseFloat(valor).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * Formatea una fecha a formato legible
 * @param {string|Date} fecha - Fecha a formatear
 * @param {boolean} incluirHora - Si incluye hora
 * @returns {string} Formato: 10/12/2024 o 10/12/2024 14:30
 */
export const formatearFecha = (fecha, incluirHora = false) => {
  const date = new Date(fecha);
  const opciones = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(incluirHora && {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  return date.toLocaleDateString('es-BO', opciones);
};

/**
 * Formatea un número con separadores de miles
 * @param {number} valor - Valor numérico
 * @returns {string} Formato: 1,234
 */
export const formatearNumero = (valor) => {
  return parseInt(valor).toLocaleString('es-BO');
};

/**
 * Formatea un porcentaje
 * @param {number} valor - Valor entre 0 y 1 o 0 y 100
 * @param {number} decimales - Decimales a mostrar
 * @returns {string} Formato: 45.6%
 */
export const formatearPorcentaje = (valor, decimales = 1) => {
  const porcentaje = valor > 1 ? valor : valor * 100;
  return `${porcentaje.toFixed(decimales)}%`;
};

// ==================== VALIDACIONES ====================

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida un NIT/CI boliviano
 * @param {string} nit - NIT a validar
 * @returns {boolean}
 */
export const validarNIT = (nit) => {
  return /^\d{5,15}$/.test(nit);
};

/**
 * Valida un número de teléfono boliviano
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean}
 */
export const validarTelefono = (telefono) => {
  return /^[67]\d{7}$/.test(telefono);
};

/**
 * Valida que un string no esté vacío
 * @param {string} valor - Valor a validar
 * @param {number} minLength - Longitud mínima
 * @returns {boolean}
 */
export const validarTexto = (valor, minLength = 1) => {
  return valor && valor.trim().length >= minLength;
};

/**
 * Valida que un número esté en un rango
 * @param {number} valor - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean}
 */
export const validarRango = (valor, min = 0, max = Infinity) => {
  const num = parseFloat(valor);
  return !isNaN(num) && num >= min && num <= max;
};

// ==================== CÁLCULOS ====================

/**
 * Calcula el porcentaje de ganancia
 * @param {number} precioCompra - Precio de compra
 * @param {number} precioVenta - Precio de venta
 * @returns {number} Porcentaje de ganancia
 */
export const calcularMargenGanancia = (precioCompra, precioVenta) => {
  if (precioCompra === 0) return 0;
  return ((precioVenta - precioCompra) / precioCompra) * 100;
};

/**
 * Calcula el descuento aplicado
 * @param {number} precioOriginal - Precio original
 * @param {number} precioFinal - Precio final
 * @returns {number} Porcentaje de descuento
 */
export const calcularDescuento = (precioOriginal, precioFinal) => {
  if (precioOriginal === 0) return 0;
  return ((precioOriginal - precioFinal) / precioOriginal) * 100;
};

/**
 * Calcula el IVA (13% en Bolivia)
 * @param {number} monto - Monto base
 * @returns {object} { iva, total }
 */
export const calcularIVA = (monto) => {
  const iva = monto * 0.13;
  const total = monto + iva;
  return { iva, total };
};

// ==================== UTILIDADES DE STRING ====================

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} str - String a capitalizar
 * @returns {string}
 */
export const capitalizarPalabras = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Trunca un texto largo
 * @param {string} texto - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string}
 */
export const truncarTexto = (texto, maxLength = 50) => {
  if (texto.length <= maxLength) return texto;
  return texto.substring(0, maxLength) + '...';
};

/**
 * Genera un slug a partir de un texto
 * @param {string} texto - Texto a convertir
 * @returns {string}
 */
export const generarSlug = (texto) => {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ==================== UTILIDADES DE ARRAY ====================

/**
 * Agrupa un array por una propiedad
 * @param {Array} array - Array a agrupar
 * @param {string} key - Propiedad para agrupar
 * @returns {Object}
 */
export const agruparPor = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Suma valores de una propiedad en un array
 * @param {Array} array - Array de objetos
 * @param {string} key - Propiedad a sumar
 * @returns {number}
 */
export const sumarPropiedad = (array, key) => {
  return array.reduce((sum, item) => sum + (parseFloat(item[key]) || 0), 0);
};

/**
 * Ordena un array por una propiedad
 * @param {Array} array - Array a ordenar
 * @param {string} key - Propiedad para ordenar
 * @param {string} order - 'asc' o 'desc'
 * @returns {Array}
 */
export const ordenarPor = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

// ==================== UTILIDADES DE FECHA ====================

/**
 * Obtiene la fecha de hoy en formato YYYY-MM-DD
 * @returns {string}
 */
export const obtenerFechaHoy = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Obtiene el primer día del mes actual
 * @returns {string}
 */
export const obtenerInicioMes = () => {
  const fecha = new Date();
  return new Date(fecha.getFullYear(), fecha.getMonth(), 1)
    .toISOString()
    .split('T')[0];
};

/**
 * Calcula la diferencia en días entre dos fechas
 * @param {string|Date} fecha1 - Primera fecha
 * @param {string|Date} fecha2 - Segunda fecha
 * @returns {number}
 */
export const calcularDiferenciaDias = (fecha1, fecha2) => {
  const date1 = new Date(fecha1);
  const date2 = new Date(fecha2);
  const diff = Math.abs(date2 - date1);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// ==================== UTILIDADES DE ALMACENAMIENTO ====================

/**
 * Guarda datos en localStorage
 * @param {string} key - Clave
 * @param {any} value - Valor a guardar
 */
export const guardarLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
  }
};

/**
 * Obtiene datos de localStorage
 * @param {string} key - Clave
 * @param {any} defaultValue - Valor por defecto
 * @returns {any}
 */
export const obtenerLocal = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error al leer de localStorage:', error);
    return defaultValue;
  }
};

/**
 * Elimina datos de localStorage
 * @param {string} key - Clave
 */
export const eliminarLocal = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error al eliminar de localStorage:', error);
  }
};

// ==================== UTILIDADES DE EXPORTACIÓN ====================

/**
 * Descarga un archivo
 * @param {Blob} blob - Contenido del archivo
 * @param {string} filename - Nombre del archivo
 */
export const descargarArchivo = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Convierte un array a CSV
 * @param {Array} data - Datos a convertir
 * @param {Array} headers - Encabezados
 * @returns {string}
 */
export const arrayToCSV = (data, headers) => {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
};

// ==================== UTILIDADES DE DEBOUNCE ====================

/**
 * Debounce function para limitar llamadas
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function}
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// ==================== UTILIDADES DE COLORES ====================

/**
 * Genera un color basado en un string
 * @param {string} str - String para generar color
 * @returns {string} Color en formato hex
 */
export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};

// ==================== EXPORTAR TODAS LAS FUNCIONES ====================

export default {
  // Formatos
  formatearMoneda,
  formatearFecha,
  formatearNumero,
  formatearPorcentaje,
  
  // Validaciones
  validarEmail,
  validarNIT,
  validarTelefono,
  validarTexto,
  validarRango,
  
  // Cálculos
  calcularMargenGanancia,
  calcularDescuento,
  calcularIVA,
  
  // Strings
  capitalizarPalabras,
  truncarTexto,
  generarSlug,
  
  // Arrays
  agruparPor,
  sumarPropiedad,
  ordenarPor,
  
  // Fechas
  obtenerFechaHoy,
  obtenerInicioMes,
  calcularDiferenciaDias,
  
  // Almacenamiento
  guardarLocal,
  obtenerLocal,
  eliminarLocal,
  
  // Exportación
  descargarArchivo,
  arrayToCSV,
  
  // Utilidades
  debounce,
  stringToColor
};