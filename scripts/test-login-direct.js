/**
 * Direct login test - bypasses HTTP and tests the auth functions directly
 */

require('dotenv').config();

async function testLogin() {
  console.log('🧪 Testing Login Functions Directly\n');

  // Import auth functions
  const { getUserByEmail, verifyPassword } = require('../src/lib/auth');
  const { initializeUsers } = require('../src/lib/users');

  // Initialize users
  initializeUsers();
  console.log('✅ Users initialized\n');

  // Test 1: Admin login
  console.log('Test 1: Admin Login');
  console.log('Email: admin@vita.ma');
  console.log('Password: admin123');
  
  try {
    const admin = await getUserByEmail('admin@vita.ma');
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found:', {
      email: admin.email,
      role: admin.role,
      passwordHash: admin.password.substring(0, 20) + '...'
    });

    const isValid = await verifyPassword('admin123', admin.password);
    if (isValid) {
      console.log('✅ Password verification: SUCCESS\n');
    } else {
      console.log('❌ Password verification: FAILED\n');
      console.log('Password hash:', admin.password);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Test 2: Customer login
  console.log('Test 2: Customer Login');
  console.log('Email: user@test.com');
  console.log('Password: user123');
  
  try {
    const user = await getUserByEmail('user@test.com');
    if (!user) {
      console.log('❌ Customer user not found');
      return;
    }
    
    console.log('✅ Customer user found:', {
      email: user.email,
      role: user.role,
      passwordHash: user.password.substring(0, 20) + '...'
    });

    const isValid = await verifyPassword('user123', user.password);
    if (isValid) {
      console.log('✅ Password verification: SUCCESS\n');
    } else {
      console.log('❌ Password verification: FAILED\n');
      console.log('Password hash:', user.password);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Test 3: Wrong password
  console.log('Test 3: Wrong Password');
  try {
    const admin = await getUserByEmail('admin@vita.ma');
    if (admin) {
      const isValid = await verifyPassword('wrongpassword', admin.password);
      if (!isValid) {
        console.log('✅ Correctly rejected wrong password\n');
      } else {
        console.log('❌ Wrong password was accepted (this is bad!)\n');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testLogin().catch(console.error);

