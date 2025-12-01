/**
 * Simple manual test script for login functionality
 * Run with: node scripts/test-login.js
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testLogin() {
  console.log('🧪 Testing Login Functionality\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  const tests = [
    {
      name: 'Test 1: Admin Login',
      email: 'admin@vita.ma',
      password: 'admin123',
      expectedRole: 'admin',
    },
    {
      name: 'Test 2: Customer Login',
      email: 'user@test.com',
      password: 'user123',
      expectedRole: 'customer',
    },
    {
      name: 'Test 3: Invalid Email',
      email: 'nonexistent@test.com',
      password: 'password123',
      shouldFail: true,
    },
    {
      name: 'Test 4: Invalid Password',
      email: 'admin@vita.ma',
      password: 'wrongpassword',
      shouldFail: true,
    },
    {
      name: 'Test 5: Missing Email',
      email: '',
      password: 'admin123',
      shouldFail: true,
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n${test.name}`);
      console.log('─'.repeat(50));

      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: test.email,
          password: test.password,
        }),
      });

      const data = await response.json();

      if (test.shouldFail) {
        if (response.status !== 200) {
          console.log(`✅ PASSED - Correctly rejected (${response.status})`);
          console.log(`   Error: ${data.error || 'Unknown error'}`);
          passed++;
        } else {
          console.log(`❌ FAILED - Should have been rejected but succeeded`);
          failed++;
        }
      } else {
        if (response.status === 200 && data.success) {
          if (test.expectedRole && data.user.role === test.expectedRole) {
            console.log(`✅ PASSED - Login successful`);
            console.log(`   User: ${data.user.email} (${data.user.role})`);
            
            // Check cookie
            const cookies = response.headers.get('set-cookie');
            if (cookies && cookies.includes('auth-token')) {
              console.log(`   Cookie: ✅ Set`);
            } else {
              console.log(`   Cookie: ⚠️  Not set`);
            }
            
            passed++;
          } else {
            console.log(`❌ FAILED - Wrong role. Expected: ${test.expectedRole}, Got: ${data.user.role}`);
            failed++;
          }
        } else {
          console.log(`❌ FAILED - Login failed (${response.status})`);
          console.log(`   Error: ${data.error || 'Unknown error'}`);
          failed++;
        }
      }
    } catch (error) {
      console.log(`❌ FAILED - Exception: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   Total: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed');
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '', password: '' }),
    });
    return true;
  } catch (error) {
    console.error(`\n❌ Cannot connect to server at ${BASE_URL}`);
    console.error('   Make sure the dev server is running: npm run dev\n');
    return false;
  }
}

// Run tests
(async () => {
  const serverRunning = await checkServer();
  if (!serverRunning) {
    process.exit(1);
  }
  await testLogin();
})();

