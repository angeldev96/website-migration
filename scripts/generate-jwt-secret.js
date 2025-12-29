#!/usr/bin/env node

/**
 * Script para generar un JWT_SECRET seguro para producción
 * 
 * Uso: node scripts/generate-jwt-secret.js
 */

const crypto = require('crypto');

function generateSecureSecret(length = 64) {
  return crypto
    .randomBytes(length)
    .toString('base64')
    .replace(/=/g, '') // Remove padding
    .replace(/\+/g, '-') // Make URL-safe
    .replace(/\//g, '_');
}

console.log('🔒 JWT_SECRET Generator para Yiddish Jobs');
console.log('========================================\n');

const secret = generateSecureSecret(64);

console.log('Tu JWT_SECRET seguro:');
console.log(secret);
console.log('\n⚠️  INSTRUCCIONES:');
console.log('1. Copia este valor');
console.log('2. Agrégalo como variable de entorno: JWT_SECRET=' + secret);
console.log('3. NUNCA compartas este valor o lo subas a GitHub/otros');
console.log('4. Guárdalo en un gestor de secrets (ej: LastPass, 1Password, Vault)\n');

console.log('✅ Para verificar que esté configurado:');
console.log('   node scripts/test-jwt-secret.js\n');

