import { db } from '../config/db.js';

// Buscar usuario por email
export const buscarUsuarioPorEmail = async (email) => {
  const [resultado] = await db.query(
    'SELECT * FROM usuarios WHERE email = ? AND activo = 1',
    [email]
  );
  return resultado[0];
};

// Crear nuevo usuario
export const crearUsuario = async (usuario) => {
  const { nombre, email, password, rol } = usuario;
  const [resultado] = await db.query(
    'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
    [nombre, email, password, rol || 'vendedor']
  );
  return { id: resultado.insertId, nombre, email, rol };
};

// Registrar log de acceso
export const registrarLogAcceso = async (logData) => {
  const { usuario_id, ip, evento, browser } = logData;
  await db.query(
    'INSERT INTO logs_acceso (usuario_id, ip, evento, browser) VALUES (?, ?, ?, ?)',
    [usuario_id, ip, evento, browser]
  );
};

// Obtener logs de un usuario
export const obtenerLogsUsuario = async (usuario_id, limite = 10) => {
  const [resultado] = await db.query(
    'SELECT * FROM logs_acceso WHERE usuario_id = ? ORDER BY fecha_hora DESC LIMIT ?',
    [usuario_id, limite]
  );
  return resultado;
};

// Obtener todos los logs (solo admin)
export const obtenerTodosLogs = async (limite = 50) => {
  const [resultado] = await db.query(
    `SELECT l.*, u.nombre, u.email 
     FROM logs_acceso l 
     INNER JOIN usuarios u ON l.usuario_id = u.id 
     ORDER BY l.fecha_hora DESC 
     LIMIT ?`,
    [limite]
  );
  return resultado;
};