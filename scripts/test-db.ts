import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...\n');

    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully\n');

    // Test User model
    const userCount = await prisma.user.count();
    console.log(`📊 Users in database: ${userCount}`);

    if (userCount > 0) {
      const users = await prisma.user.findMany({
        take: 5,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });
      console.log('\n👥 Sample users:');
      users.forEach((user) => {
        console.log(`   - ${user.email} (${user.role})`);
      });
    }

    // Test Product model
    const productCount = await prisma.product.count();
    console.log(`\n📦 Products in database: ${productCount}`);

    if (productCount > 0) {
      const products = await prisma.product.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
        },
      });
      console.log('\n🛍️  Sample products:');
      products.forEach((product) => {
        console.log(`   - ${product.name} (${product.price} MAD, Stock: ${product.stock})`);
      });
    }

    // Test Order model
    const orderCount = await prisma.order.count();
    console.log(`\n📋 Orders in database: ${orderCount}`);

    console.log('\n✅ All database tests passed!');
  } catch (error) {
    console.error('\n❌ Database test failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();

