// Script para generar hash de contraseñas
// Ejecutar: node generarPassword.js

import bcrypt from 'bcryptjs';

const generarHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('===========================================');
  console.log('Generador de Hash de Contraseñas');
  console.log('===========================================');
  console.log(`Contraseña original: ${password}`);
  console.log(`Hash generado: ${hash}`);
  console.log('===========================================');
  console.log('\nSQL para insertar en la base de datos:');
  console.log(`INSERT INTO usuarios (nombre, email, password, rol) VALUES`);
  console.log(`('Administrador', 'admin@tienda.com', '${hash}', 'admin');`);
  console.log('===========================================');
};

// Cambiar 'admin123' por la contraseña que desees
generarHash('admin123');