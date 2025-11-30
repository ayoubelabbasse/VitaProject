import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail as getUserByEmailFromFile, createUser as createUserInFile, type User } from './users';

const JWT_SECRET = process.env.JWT_SECRET || 'vita-project-secret-key-change-in-production-2024';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return getUserByEmailFromFile(email);
}

export async function createUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
}) {
  return createUserInFile({
    ...data,
    role: (data.role as 'admin' | 'customer') || 'customer',
  });
}

