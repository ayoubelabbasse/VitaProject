/**
 * @jest-environment node
 */

import { POST } from '@/app/api/auth/login/route'
import { POST as RegisterPOST } from '@/app/api/auth/register/route'
import { GET } from '@/app/api/auth/me/route'
import { NextRequest } from 'next/server'
import { initializeUsers } from '@/lib/users'
import fs from 'fs'
import path from 'path'

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

beforeEach(() => {
  // Clean and initialize before each test
  if (fs.existsSync(USERS_FILE)) {
    fs.unlinkSync(USERS_FILE)
  }
  initializeUsers()
})

describe('Login Flow Integration Tests', () => {
  describe('Complete Authentication Flow', () => {
    it('should complete full login flow: register -> login -> get user', async () => {
      // Step 1: Register new user
      const registerRequest = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'integration@test.com',
          password: 'testpassword123',
          firstName: 'Integration',
          lastName: 'Test',
          phone: '+212 6XX XXX XXX',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const registerResponse = await RegisterPOST(registerRequest)
      expect(registerResponse.status).toBe(200)
      
      const registerData = await registerResponse.json()
      expect(registerData.success).toBe(true)
      expect(registerData.user.email).toBe('integration@test.com')

      // Step 2: Login with new user
      const loginRequest = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'integration@test.com',
          password: 'testpassword123',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const loginResponse = await POST(loginRequest)
      expect(loginResponse.status).toBe(200)
      
      const loginData = await loginResponse.json()
      expect(loginData.success).toBe(true)
      expect(loginData.user.email).toBe('integration@test.com')

      // Step 3: Get user info using auth token
      const authToken = loginResponse.cookies.get('auth-token')?.value
      expect(authToken).toBeDefined()

      const meRequest = new NextRequest('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
          Cookie: `auth-token=${authToken}`,
        },
      })

      const meResponse = await GET(meRequest)
      expect(meResponse.status).toBe(200)
      
      const meData = await meResponse.json()
      expect(meData.user).toBeDefined()
      expect(meData.user.email).toBe('integration@test.com')
    })

    it('should handle admin login and redirect logic', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'admin@vita.ma',
          password: 'admin123',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user.role).toBe('admin')
    })

    it('should handle customer login', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@test.com',
          password: 'user123',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user.role).toBe('customer')
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid credentials gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'admin@vita.ma',
          password: 'wrongpassword',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBeDefined()
      expect(data.error).toContain('Invalid')
    })

    it('should handle malformed requests', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Should handle JSON parse errors gracefully
      const response = await POST(request)
      expect(response.status).toBeGreaterThanOrEqual(400)
      const data = await response.json()
      expect(data.error).toBeDefined()
    })
  })
})

