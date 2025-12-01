/**
 * @jest-environment node
 */

import { POST } from '@/app/api/auth/login/route'
import { NextRequest } from 'next/server'
import { initializeUsers, getUserByEmail } from '@/lib/users'
import bcrypt from 'bcryptjs'

// Initialize users before tests
beforeAll(() => {
  initializeUsers()
})

describe('/api/auth/login', () => {
  beforeEach(() => {
    // Reset users file to default state
    initializeUsers()
  })

  it('should successfully login with valid credentials', async () => {
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
    expect(data.success).toBe(true)
    expect(data.user).toBeDefined()
    expect(data.user.email).toBe('admin@vita.ma')
    expect(data.user.role).toBe('admin')
    expect(data.user.password).toBeUndefined()
    
    // Check cookie is set
    const cookies = response.cookies.getAll()
    expect(cookies.some(cookie => cookie.name === 'auth-token')).toBe(true)
  })

  it('should fail with invalid email', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nonexistent@test.com',
        password: 'password123',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBeDefined()
  })

  it('should fail with invalid password', async () => {
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
  })

  it('should fail with missing email', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        password: 'admin123',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('required')
  })

  it('should fail with missing password', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@vita.ma',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('required')
  })

  it('should login customer user successfully', async () => {
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
    expect(data.success).toBe(true)
    expect(data.user.role).toBe('customer')
  })
})

