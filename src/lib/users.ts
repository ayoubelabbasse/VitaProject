import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'customer';
  createdAt: string;
  updatedAt: string;
}

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read users from file
function readUsers(): User[] {
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
function writeUsers(users: User[]): void {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

// Initialize with default users if file doesn't exist
export function initializeUsers() {
  const users = readUsers();
  if (users.length === 0) {
    // Create default admin and user (using sync version for initialization)
    const defaultUsers: User[] = [
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
    console.log('✅ Initialized default users');
  }
}

// Get user by email
export function getUserByEmail(email: string): User | null {
  const users = readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

// Get user by ID
export function getUserById(id: string): User | null {
  const users = readUsers();
  return users.find((u) => u.id === id) || null;
}

// Create new user
export async function createUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'admin' | 'customer';
}): Promise<Omit<User, 'password'>> {
  const users = readUsers();
  
  // Check if user exists
  if (getUserByEmail(data.email)) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user
  const newUser: User = {
    id: Date.now().toString(),
    email: data.email.toLowerCase(),
    password: hashedPassword,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    role: data.role || 'customer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

// Initialize users on module load
initializeUsers();

