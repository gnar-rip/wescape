const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('Prisma works:', result);
  } catch (e) {
    console.error('Prisma error:', e);
  } finally {
    await prisma.$disconnect();
  }
})();
