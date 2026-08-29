import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@stockflow.com' },
    update: {},
    create: {
      name: 'Administrador StockFlow',
      email: 'admin@stockflow.com',
      passwordHash: adminPassword,
      role: Role.ADMIN
    }
  });

  await prisma.user.upsert({
    where: { email: 'user@stockflow.com' },
    update: {},
    create: {
      name: 'Usuario Operacional',
      email: 'user@stockflow.com',
      passwordHash: userPassword,
      role: Role.USER
    }
  });

  const category = await prisma.category.upsert({
    where: { name: 'Bebidas' },
    update: {},
    create: { name: 'Bebidas' }
  });

  await prisma.product.upsert({
    where: { code: 'COCA-2L' },
    update: {},
    create: {
      name: 'Coca-Cola 2L',
      description: 'Refrigerante retornavel para venda no balcao.',
      code: 'COCA-2L',
      price: 9.5,
      quantity: 10,
      minimumStock: 5,
      categoryId: category.id
    }
  });

  await prisma.product.upsert({
    where: { code: 'AGUA-500' },
    update: {},
    create: {
      name: 'Agua mineral 500ml',
      description: 'Garrafa individual.',
      code: 'AGUA-500',
      price: 3.25,
      quantity: 4,
      minimumStock: 8,
      categoryId: category.id
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

