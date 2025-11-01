#!/usr/bin/env node
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.EMAIL || 'admin@example.com';
  const password = process.env.PASSWORD || 'ChangeMe123!';
  const role = (process.env.ROLE || 'ADMIN').toUpperCase();

  if (!['ADMIN', 'USER'].includes(role)) {
    console.error('ROLE must be ADMIN or USER');
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('User already exists:', existing.email, 'id=', existing.id);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      role
    }
  });

  console.log('Created user:', { id: user.id, email: user.email, role: user.role });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
