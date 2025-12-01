/**
 * @jest-environment node
 */

import fs from 'fs'
import path from 'path'
import {
  getUserByEmail,
  getUserById,
  createUser,
  initializeUsers,
} from '@/lib/users'

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

// Clean up before each test
beforeEach(() => {
  // Delete users file if it exists
  if (fs.existsSync(USERS_FILE)) {
    fs.unlinkSync(USERS_FILE)
  }
  // Reinitialize
  initializeUsers()
})

afterAll(() => {
  // Clean up test data
  if (fs.existsSync(USERS_FILE)) {
    fs.unlinkSync(USERS_FILE)
  }
})

describe('User Management', () => {
  describe('initializeUsers', () => {
    it('should create default users on first run', () => {
      expect(fs.existsSync(USERS_FILE)).toBe(true)
      
      const admin = getUserByEmail('admin@vita.ma')
      const user = getUserByEmail('user@test.com')
      
      expect(admin).not.toBeNull()
      expect(user).not.toBeNull()
      expect(admin?.role).toBe('admin')
      expect(user?.role).toBe('customer')
    })
  })

  describe('getUserByEmail', () => {
    it('should find user by email', () => {
      const user = getUserByEmail('admin@vita.ma')
      
      expect(user).not.toBeNull()
      expect(user?.email).toBe('admin@vita.ma')
    })

    it('should be case-insensitive', () => {
      const user1 = getUserByEmail('admin@vita.ma')
      const user2 = getUserByEmail('ADMIN@VITA.MA')
      
      expect(user1).not.toBeNull()
      expect(user2).not.toBeNull()
      expect(user1?.id).toBe(user2?.id)
    })

    it('should return null for non-existent user', () => {
      const user = getUserByEmail('nonexistent@test.com')
      
      expect(user).toBeNull()
    })
  })

  describe('getUserById', () => {
    it('should find user by ID', () => {
      const admin = getUserByEmail('admin@vita.ma')
      expect(admin).not.toBeNull()
      
      const user = getUserById(admin!.id)
      
      expect(user).not.toBeNull()
      expect(user?.id).toBe(admin!.id)
    })

    it('should return null for non-existent ID', () => {
      const user = getUserById('nonexistent-id')
      
      expect(user).toBeNull()
    })
  })

  describe('createUser', () => {
    it('should create new user', async () => {
      const newUser = await createUser({
        email: 'newuser@test.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        role: 'customer',
      })
      
      expect(newUser).toBeDefined()
      expect(newUser.email).toBe('newuser@test.com')
      expect(newUser.firstName).toBe('New')
      expect(newUser.password).toBeUndefined() // Should not return password
      
      // Verify user exists in file
      const user = getUserByEmail('newuser@test.com')
      expect(user).not.toBeNull()
      expect(user?.email).toBe('newuser@test.com')
    })

    it('should hash password before storing', async () => {
      const newUser = await createUser({
        email: 'hashed@test.com',
        password: 'plainpassword',
        firstName: 'Test',
        lastName: 'User',
      })
      
      const user = getUserByEmail('hashed@test.com')
      expect(user).not.toBeNull()
      expect(user?.password).not.toBe('plainpassword')
      expect(user?.password.length).toBeGreaterThan(20) // bcrypt hash
    })

    it('should prevent duplicate emails', async () => {
      await createUser({
        email: 'duplicate@test.com',
        password: 'password123',
        firstName: 'First',
        lastName: 'User',
      })
      
      await expect(
        createUser({
          email: 'duplicate@test.com',
          password: 'password123',
          firstName: 'Second',
          lastName: 'User',
        })
      ).rejects.toThrow('already exists')
    })

    it('should default to customer role', async () => {
      const newUser = await createUser({
        email: 'customer@test.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })
      
      expect(newUser.role).toBe('customer')
    })

    it('should allow admin role', async () => {
      const newUser = await createUser({
        email: 'admin@test.com',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      })
      
      expect(newUser.role).toBe('admin')
    })
  })
})

