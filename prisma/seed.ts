import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { getProductMediaByName } from '../src/constants/paths';

const prisma = new PrismaClient();

const productImage = (name: string) => getProductMediaByName(name).primary;

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vita.ma' },
    update: {},
    create: {
      email: 'admin@vita.ma',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+212 6XX XXX XXX',
      role: 'admin',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create test customer user
  const customerPassword = await bcrypt.hash('user123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password: customerPassword,
      firstName: 'Test',
      lastName: 'User',
      phone: '+212 6XX XXX XXX',
      role: 'customer',
    },
  });

  console.log('✅ Customer user created:', customer.email);

  // Create sample products
  const products = [
    {
      name: 'Omega-3 Fish Oil',
      category: 'Heart Health',
      brand: 'NOW Foods',
      price: 119.99,
      originalPrice: 139.99,
      image: productImage('Omega-3 Fish Oil'),
      description:
        '<p>Molecularly distilled fish oil delivering 1,000 mg omega-3 per softgel to support heart, brain, and joint health.</p>',
      stock: 75,
      inStock: true,
      rating: 4.8,
      reviews: 286,
      benefits: JSON.stringify(['Cardiovascular support', 'Brain health', 'Joint comfort']),
      ingredients: JSON.stringify([
        'Fish Oil Concentrate (anchovy, sardine, mackerel)',
        'Softgel Capsule (gelatin, glycerin, water)',
        'Vitamin E (mixed tocopherols)',
      ]),
    },
    {
      name: 'Vitamin D3 & K2',
      category: 'Immune Support',
      brand: 'NOW Foods',
      price: 94.99,
      originalPrice: 109.99,
      image: productImage('Vitamin D3 & K2'),
      description:
        '<p>Balanced D3 and MK-7 softgels that help direct calcium into bones while reinforcing immune and cardiovascular health.</p>',
      stock: 90,
      inStock: true,
      rating: 4.9,
      reviews: 198,
      benefits: JSON.stringify(['Bone density', 'Immune resilience', 'Calcium utilisation']),
      ingredients: JSON.stringify([
        'Vitamin D3 (cholecalciferol)',
        'Vitamin K2 (menaquinone-7)',
        'Sunflower Oil',
        'Softgel Capsule (gelatin, glycerin, water)',
      ]),
    },
    {
      name: 'Magnesium Caps 500 mg',
      category: 'Minerals',
      brand: 'Life Extension',
      price: 129.99,
      originalPrice: 149.99,
      image: productImage('Magnesium Caps 500 mg'),
      description:
        '<p>Bioavailable magnesium complex combining oxide, citrate, and succinate to relax muscles and support heart rhythm.</p>',
      stock: 60,
      inStock: true,
      rating: 4.8,
      reviews: 164,
      benefits: JSON.stringify(['Muscle relaxation', 'Cardiovascular health', 'Energy metabolism']),
      ingredients: JSON.stringify([
        'Magnesium (oxide, citrate, succinate)',
        'Vegetable Cellulose Capsule',
        'Vegetable Stearate',
      ]),
    },
    {
      name: 'Zinc 50 mg',
      category: 'Minerals',
      brand: 'NOW Foods',
      price: 74.99,
      originalPrice: 84.99,
      image: productImage('Zinc 50 mg'),
      description:
        '<p>High-potency zinc gluconate tablets formulated to keep immune defenses, skin, and antioxidant activity robust.</p>',
      stock: 110,
      inStock: true,
      rating: 4.7,
      reviews: 142,
      benefits: JSON.stringify(['Immune defence', 'Skin health', 'Antioxidant support']),
      ingredients: JSON.stringify(['Zinc (gluconate)', 'Cellulose', 'Stearic Acid', 'Magnesium Stearate', 'Silica']),
    },
    {
      name: 'Magnesium Glycinate',
      category: 'Relaxation & Sleep',
      brand: 'NOW Foods',
      price: 129.99,
      originalPrice: 149.99,
      image: productImage('Magnesium Glycinate'),
      description:
        '<p>Fully chelated magnesium bisglycinate designed for gentle absorption to ease tension and promote restorative sleep.</p>',
      stock: 85,
      inStock: true,
      rating: 4.9,
      reviews: 214,
      benefits: JSON.stringify(['Restful sleep', 'Muscle relaxation', 'Stress management']),
      ingredients: JSON.stringify([
        'Magnesium (bisglycinate)',
        'Cellulose',
        'Stearic Acid',
        'Magnesium Stearate',
        'Silica',
      ]),
    },
    {
      name: 'Vitamin D3 5,000 IU',
      category: 'Immune Support',
      brand: 'California Gold Nutrition',
      price: 84.99,
      originalPrice: 99.99,
      image: productImage('Vitamin D3 5,000 IU'),
      description:
        '<p>High-potency vitamin D3 softgels sourced from lanolin to support immune vigilance, calcium uptake, and balanced mood.</p>',
      stock: 140,
      inStock: true,
      rating: 4.9,
      reviews: 328,
      benefits: JSON.stringify(['Immune readiness', 'Bone strength', 'Mood support']),
      ingredients: JSON.stringify([
        'Vitamin D3 (cholecalciferol)',
        'Extra Virgin Olive Oil',
        'Softgel Capsule (gelatin, glycerin, water)',
      ]),
    },
    {
      name: 'Iron 36 mg',
      category: 'Minerals',
      brand: 'NOW Foods',
      price: 92.99,
      originalPrice: 104.99,
      image: productImage('Iron 36 mg'),
      description:
        '<p>Gentle iron bisglycinate capsules that replenish iron stores and energy without the digestive discomfort of traditional iron.</p>',
      stock: 95,
      inStock: true,
      rating: 4.6,
      reviews: 88,
      benefits: JSON.stringify(['Energy production', 'Healthy hemoglobin', 'Oxygen transport']),
      ingredients: JSON.stringify([
        'Iron (ferrous bisglycinate)',
        'Rice Flour',
        'Cellulose Capsule',
        'Stearic Acid',
        'Silica',
      ]),
    },
    {
      name: "Alive! Hair, Skin & Nails Gummies",
      category: 'Beauty Nutrition',
      brand: "Nature's Way",
      price: 129.99,
      originalPrice: 149.99,
      image: productImage("Alive! Hair, Skin & Nails Gummies"),
      description:
        '<p>Strawberry gummies with biotin, collagen, and antioxidants to nourish hair, skin, and nails from within.</p>',
      stock: 70,
      inStock: true,
      rating: 4.7,
      reviews: 244,
      benefits: JSON.stringify(['Hair strength', 'Glowing skin', 'Nail resilience']),
      ingredients: JSON.stringify(['Biotin', 'Collagen', 'Vitamin C', 'Pectin', 'Natural Strawberry Flavour']),
    },
    {
      name: 'Ultra Omega-3 Fish Oil',
      category: 'Heart Health',
      brand: 'NOW Foods',
      price: 159.99,
      originalPrice: 179.99,
      image: productImage('Ultra Omega-3 Fish Oil'),
      description:
        '<p>Enteric-coated softgels with 500 mg EPA and 250 mg DHA to maintain triglyceride balance and cognitive clarity.</p>',
      stock: 65,
      inStock: true,
      rating: 4.9,
      reviews: 193,
      benefits: JSON.stringify(['Triglyceride balance', 'Cognitive clarity', 'Eye health']),
      ingredients: JSON.stringify([
        'Fish Oil Concentrate',
        'Softgel Capsule (gelatin, glycerin, water)',
        'Enteric Coating',
        'Vitamin E (mixed tocopherols)',
      ]),
    },
    {
      name: 'Potassium Gluconate 595 mg',
      category: 'Minerals',
      brand: '21st Century',
      price: 64.99,
      originalPrice: 74.99,
      image: productImage('Potassium Gluconate 595 mg'),
      description:
        '<p>Essential mineral tablets providing 99 mg elemental potassium to maintain fluid balance and normal muscle function.</p>',
      stock: 120,
      inStock: true,
      rating: 4.6,
      reviews: 156,
      benefits: JSON.stringify(['Electrolyte balance', 'Muscle function', 'Nerve transmission']),
      ingredients: JSON.stringify(['Potassium (gluconate)', 'Cellulose', 'Stearic Acid', 'Magnesium Stearate', 'Silica']),
    },
    {
      name: 'Full Spectrum Ashwagandha',
      category: 'Stress Support',
      brand: 'Swanson',
      price: 74.99,
      originalPrice: 89.99,
      image: productImage('Full Spectrum Ashwagandha'),
      description:
        '<p>Organic ashwagandha root capsules helping the body adapt to daily stress while promoting calm focus.</p>',
      stock: 80,
      inStock: true,
      rating: 4.8,
      reviews: 176,
      benefits: JSON.stringify(['Stress relief', 'Cortisol balance', 'Mood stability']),
      ingredients: JSON.stringify(['Organic Ashwagandha Root', 'Vegetable Capsule', 'Rice Flour']),
    },
    {
      name: 'Omega-3 Premium Fish Oil',
      category: 'Heart Health',
      brand: 'California Gold Nutrition',
      price: 139.99,
      originalPrice: 159.99,
      image: productImage('Omega-3 Premium Fish Oil'),
      description:
        '<p>IFOS 5-star certified fish oil delivering 180 mg EPA and 120 mg DHA per softgel with natural lemon flavour for superior freshness.</p>',
      stock: 105,
      inStock: true,
      rating: 4.9,
      reviews: 412,
      benefits: JSON.stringify(['Cardiovascular health', 'Brain support', 'Immune modulation']),
      ingredients: JSON.stringify([
        'Fish Oil Concentrate (anchovy, sardine)',
        'Softgel Capsule (gelatin, glycerin, water)',
        'Natural Lemon Flavour',
        'Mixed Tocopherols',
      ]),
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    }).catch(() => {
      // Product might already exist, skip
    });
  }

  console.log('✅ Sample products created');

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Test Credentials:');
  console.log('Admin - Email: admin@vita.ma, Password: admin123');
  console.log('User - Email: user@test.com, Password: user123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

