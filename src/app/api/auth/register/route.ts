import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, generateToken } from '@/lib/auth';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  return /^[0-9+\-\s()]+$/.test(phone);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone } = body;

    // Validation
    const fieldErrors: Record<string, string> = {};

    if (!email || !String(email).trim()) fieldErrors.email = 'Email is required';
    if (!password || !String(password)) fieldErrors.password = 'Password is required';
    if (!firstName || !String(firstName).trim()) fieldErrors.firstName = 'First name is required';
    if (!lastName || !String(lastName).trim()) fieldErrors.lastName = 'Last name is required';
    if (!phone || !String(phone).trim()) fieldErrors.phone = 'Phone number is required';

    if (!fieldErrors.email && !isValidEmail(String(email).trim())) {
      fieldErrors.email = 'Please enter a valid email';
    }

    if (!fieldErrors.phone && !isValidPhone(String(phone).trim())) {
      fieldErrors.phone = 'Please enter a valid phone number';
    }

    if (!fieldErrors.password && String(password).length < 8) {
      fieldErrors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        { error: 'Validation error', fieldErrors },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await getUserByEmail(String(email));
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists', fieldErrors: { email: 'User already exists' } },
        { status: 409 }
      );
    }

    // Create user
    const user = await createUser({
      email,
      password,
      firstName,
      lastName,
      phone,
    });

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);

    // Known / mapped errors
    if (error?.code === 'USER_EXISTS') {
      return NextResponse.json(
        { error: 'User already exists', fieldErrors: { email: 'User already exists' } },
        { status: 409 }
      );
    }

    // If DB is not configured (common on deploy if DATABASE_URL missing)
    const msg = String(error?.message || '');
    if (msg.toLowerCase().includes('database') || msg.toLowerCase().includes('prisma')) {
      return NextResponse.json(
        { error: 'Database not available. Please configure DATABASE_URL.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

