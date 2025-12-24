import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail as getUserByEmailFromFile, createUser as createUserInFile, type User } from './users';
import { prisma } from './prisma';

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
    { expiresIn: '10m' } // 10-minute session
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
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) return null;

  // Prefer database when available (required for deployed environments where FS is read-only)
  if (prisma) {
    const dbUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    return (dbUser as unknown as User) ?? null;
  }

  return getUserByEmailFromFile(normalizedEmail);
}

export async function getUserById(id: string): Promise<User | null> {
  const normalizedId = String(id || '').trim();
  if (!normalizedId) return null;

  if (prisma) {
    const dbUser = await prisma.user.findUnique({
      where: { id: normalizedId },
    });
    return (dbUser as unknown as User) ?? null;
  }

  // File fallback
  const { getUserById: getUserByIdFromFile } = await import('./users');
  return getUserByIdFromFile(normalizedId) as unknown as User | null;
}

export async function createUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
}) {
  const email = String(data.email || '').trim().toLowerCase();
  const password = String(data.password || '');
  const firstName = String(data.firstName || '').trim();
  const lastName = String(data.lastName || '').trim();
  const phone = data.phone ? String(data.phone).trim() : undefined;
  const role = (data.role as 'admin' | 'customer') || 'customer';

  if (prisma) {
    const hashed = await bcrypt.hash(password, 10);
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashed,
          firstName,
          lastName,
          phone,
          role,
        },
      });
      return user;
    } catch (err: any) {
      // Prisma unique constraint
      if (err?.code === 'P2002') {
        const error = new Error('User already exists');
        (error as any).code = 'USER_EXISTS';
        throw error;
      }
      throw err;
    }
  }

  // File fallback (local/dev)
  return createUserInFile({
    email,
    password,
    firstName,
    lastName,
    phone,
    role,
  });
}

