/**
 * Fix users file - ensure default users are properly initialized
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read users from file
function readUsers() {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

// Write users to file
function writeUsers(users) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function fixUsers() {
  console.log('🔧 Fixing users file...\n');
  
  // Delete existing file
  if (fs.existsSync(USERS_FILE)) {
    fs.unlinkSync(USERS_FILE);
    console.log('✅ Deleted existing users file');
  }

  // Create default users with fresh password hashes
  const defaultUsers = [
    {
      id: '1',
      email: 'admin@vita.ma',
      password: bcrypt.hashSync('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      phone: '+212 6XX XXX XXX',
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'user@test.com',
      password: bcrypt.hashSync('user123', 10),
      firstName: 'Test',
      lastName: 'User',
      phone: '+212 6XX XXX XXX',
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  writeUsers(defaultUsers);
  console.log('✅ Created default users:');
  console.log('   - admin@vita.ma (password: admin123)');
  console.log('   - user@test.com (password: user123)');
  console.log('\n✅ Users file fixed!');
}

fixUsers();

