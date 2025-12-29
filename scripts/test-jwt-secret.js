#!/usr/bin/env node

/**
 * Script para verificar que JWT_SECRET esté configurado correctamente
 * 
 * Uso: node scripts/test-jwt-secret.js
 */

require('dotenv').config();

console.log('🔒 Verificador de configuración JWT_SECRET');
console.log('==========================================\n');

const jwtSecret = process.env.JWT_SECRET;
const nodeEnv = process.env.NODE_ENV || 'development';

// Verificar si está presente
if (!jwtSecret) {
  console.error('❌ ERROR CRÍTICO: JWT_SECRET no está configurado');
  console.error('\nSolución:');
  console.error('1. Genera un JWT_SECRET seguro: node scripts/generate-jwt-secret.js');
  console.error('2. Agrégalo a tu archivo .env: JWT_SECRET=tu_valor');
  console.error('3. Reincia tu servidor de desarrollo\n');
  process.exit(1);
}

// Verificar si usa valor por defecto
if (jwtSecret === 'change-me') {
  if (nodeEnv === 'production') {
    console.error('❌ ERROR CRÍTICO: JWT_SECRET usa valor por defecto en PRODUCCIÓN');
    console.error('\n¡ESTO ES UNA VULNERABILIDAD DE SEGURIDAD!');
    console.error('Cualquiera puede acceder como administrador.\n');
    console.error('Solución inmediata:');
    console.error('1. Genera un JWT_SECRET seguro: node scripts/generate-jwt-secret.js');
    console.error('2. Agrégalo a las variables de entorno de tu plataforma de hosting');
    console.error('3. Re-deploy tu aplicación\n');
    process.exit(1);
  } else {
    console.warn('⚠️  ADVERTENCIA: JWT_SECRET usa valor por defecto en DESARROLLO');
    console.warn('Esto es OK para desarrollo, pero NO para producción.\n');
  }
}

// Verificar longitud
if (jwtSecret.length < 32) {
  console.error('❌ ERROR: JWT_SECRET es muy corto (menos de 32 caracteres)');
  console.error('\nUn JWT_SECRET corto es vulnerable a ataques de fuerza bruta.');
  console.error('Solución:');
  console.error('Genera un nuevo JWT_SECRET con: node scripts/generate-jwt-secret.js\n');
  process.exit(1);
}

// Verificar fortaleza
const hasLowerCase = /[a-z]/.test(jwtSecret);
const hasUpperCase = /[A-Z]/.test(jwtSecret);
const hasNumbers = /[0-9]/.test(jwtSecret);
const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(jwtSecret);

console.log('✅ JWT_SECRET está configurado');
console.log(`   Longitud: ${jwtSecret.length} caracteres`);
console.log(`   Entorno: ${nodeEnv}`);
console.log('\nFortaleza:');
console.log(`   ✓ Tiene minúsculas: ${hasLowerCase ? 'Sí' : 'No'}`);
console.log(`   ✓ Tiene mayúsculas: ${hasUpperCase ? 'Sí' : 'No'}`);
console.log(`   ✓ Tiene números: ${hasNumbers ? 'Sí' : 'No'}`);
console.log(`   ✓ Tiene caracteres especiales: ${hasSpecial ? 'Sí' : 'No'}`);

const strength = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecial].filter(Boolean).length;

if (strength >= 4) {
  console.log('\n✅ Fortaleza: Excelente - JWT_SECRET es muy seguro');
} else if (strength === 3) {
  console.log('\n✅ Fortaleza: Buena - JWT_SECRET es seguro');
  console.warn('  Considera agregar caracteres adicionales para mayor seguridad');
} else if (strength === 2) {
  console.warn('\n⚠️  Fortaleza: Media - Podría ser mejor');
  console.warn('  Considera regenerar con: node scripts/generate-jwt-secret.js');
} else {
  console.error('\n❌ Fortaleza: Débil - JWT_SECRET es vulnerable');
  console.error('  Debes regenerar con: node scripts/generate-jwt-secret.js\n');
  process.exit(1);
}

console.log('\n📊 Resumen:');
console.log(`   JWT_SECRET está ${strength >= 3 ? 'BIEN configurado' : 'POBREMENTE configurado'}`);
console.log(`   Nivel de seguridad: ${strength}/4`);
console.log('\n✅ Todo parece estar en orden para usar la aplicación.\n');

