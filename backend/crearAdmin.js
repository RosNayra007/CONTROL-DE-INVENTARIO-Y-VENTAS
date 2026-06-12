// Script para crear el primer usuario administrador
// Ejecutar: node crearAdmin.js

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const crearAdmin = async () => {
  try {
    console.log('==========================================');
    console.log('Creando usuario administrador...');
    console.log('==========================================\n');

    // Conectar a la base de datos
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'inventario_ventas_db'
    });

    console.log('✅ Conectado a la base de datos\n');

    // Datos del administrador
    const nombre = 'Administrador del Sistema';
    const email = 'admin@tienda.com';
    const password = 'Admin123!';
    const rol = 'admin';

    // Verificar si el usuario ya existe
    const [existente] = await connection.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existente.length > 0) {
      console.log('⚠️  El usuario admin ya existe en la base de datos');
      console.log(`   Email: ${email}`);
      console.log('\n¿Deseas actualizar su contraseña? (Sí/No)');
      console.log('Modificar manualmente en la base de datos si es necesario\n');
      await connection.end();
      return;
    }

    // Encriptar contraseña
    console.log('🔐 Encriptando contraseña...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insertar usuario
    const [resultado] = await connection.query(
      'INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, passwordHash, rol, 1]
    );

    console.log('\n✅ Usuario administrador creado exitosamente!\n');
    console.log('==========================================');
    console.log('CREDENCIALES DE ACCESO');
    console.log('==========================================');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Rol:      ${rol}`);
    console.log('==========================================\n');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');
    console.log('==========================================\n');

    await connection.end();

  } catch (error) {
    console.error('\n❌ Error al crear usuario administrador:', error.message);
    console.error('\nVerifica que:');
    console.error('  1. MySQL esté corriendo');
    console.error('  2. La base de datos exista');
    console.error('  3. Las credenciales en .env sean correctas\n');
    process.exit(1);
  }
};

crearAdmin();