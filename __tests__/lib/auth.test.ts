/**
 * @jest-environment node
 */

import {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  getUserByEmail,
} from '@/lib/auth'
import { initializeUsers } from '@/lib/users'

beforeAll(() => {
  initializeUsers()
})

describe('Auth Utilities', () => {
  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)
      
      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(20) // bcrypt hashes are long
    })

    it('should produce different hashes for same password', async () => {
      const password = 'testpassword123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)
      
      // Different salts mean different hashes
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(password, hash)
      
      expect(isValid).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword('wrongpassword', hash)
      
      expect(isValid).toBe(false)
    })
  })

  describe('generateToken', () => {
    it('should generate valid JWT token', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        role: 'admin',
      }
      
      const token = generateToken(user)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })

    it('should include user data in token', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        role: 'admin',
      }
      
      const token = generateToken(user)
      const decoded = verifyToken(token)
      
      expect(decoded).not.toBeNull()
      expect(decoded?.id).toBe(user.id)
      expect(decoded?.email).toBe(user.email)
      expect(decoded?.role).toBe(user.role)
    })
  })

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        role: 'admin',
      }
      
      const token = generateToken(user)
      const decoded = verifyToken(token)
      
      expect(decoded).not.toBeNull()
      expect(decoded?.id).toBe(user.id)
    })

    it('should reject invalid token', () => {
      const decoded = verifyToken('invalid.token.here')
      
      expect(decoded).toBeNull()
    })

    it('should reject empty token', () => {
      const decoded = verifyToken('')
      
      expect(decoded).toBeNull()
    })
  })

  describe('getUserByEmail', () => {
    it('should find existing user', async () => {
      const user = await getUserByEmail('admin@vita.ma')
      
      expect(user).not.toBeNull()
      expect(user?.email).toBe('admin@vita.ma')
      expect(user?.role).toBe('admin')
    })

    it('should return null for non-existent user', async () => {
      const user = await getUserByEmail('nonexistent@test.com')
      
      expect(user).toBeNull()
    })

    it('should be case-insensitive', async () => {
      const user1 = await getUserByEmail('admin@vita.ma')
      const user2 = await getUserByEmail('ADMIN@VITA.MA')
      
      expect(user1).not.toBeNull()
      expect(user2).not.toBeNull()
      expect(user1?.email).toBe(user2?.email)
    })
  })
})

