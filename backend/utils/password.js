import bcrypt from 'bcryptjs';

// Encriptar contraseña
export const encriptarPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Comparar contraseña
export const compararPassword = async (password, passwordHash) => {
  return await bcrypt.compare(password, passwordHash);
};

// Validar fortaleza de la contraseña
export const validarFortalezaPassword = (password) => {
  // Criterios:
  // Débil: menos de 6 caracteres
  // Intermedio: 6-8 caracteres, al menos una letra y un número
  // Fuerte: más de 8 caracteres, letras mayúsculas, minúsculas, números y símbolos

  const longitud = password.length;
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneMinuscula = /[a-z]/.test(password);
  const tieneNumero = /[0-9]/.test(password);
  const tieneSimbolo = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let fortaleza = 'débil';
  let mensaje = '';
  let puntaje = 0;

  // Calcular puntaje
  if (longitud >= 6) puntaje++;
  if (longitud >= 8) puntaje++;
  if (longitud >= 12) puntaje++;
  if (tieneMayuscula) puntaje++;
  if (tieneMinuscula) puntaje++;
  if (tieneNumero) puntaje++;
  if (tieneSimbolo) puntaje++;

  // Determinar fortaleza
  if (puntaje <= 2) {
    fortaleza = 'débil';
    mensaje = 'La contraseña es muy débil. Debe tener al menos 6 caracteres.';
  } else if (puntaje <= 4) {
    fortaleza = 'intermedio';
    mensaje = 'La contraseña es de nivel intermedio. Considere agregar más caracteres o símbolos.';
  } else {
    fortaleza = 'fuerte';
    mensaje = 'La contraseña es fuerte. ¡Buen trabajo!';
  }

  return {
    fortaleza,
    mensaje,
    puntaje,
    criterios: {
      longitud: longitud >= 8,
      mayuscula: tieneMayuscula,
      minuscula: tieneMinuscula,
      numero: tieneNumero,
      simbolo: tieneSimbolo
    }
  };
};