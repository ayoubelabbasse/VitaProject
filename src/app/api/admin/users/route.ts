import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import fs from 'fs';
import path from 'path';

// Helper to read users from JSON file
function getAllUsers() {
  try {
    const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
    
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    const users = JSON.parse(data);
    
    // Remove passwords and return
    return users.map((user: any) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  
  if (authResult.error) {
    return authResult.error;
  }

  const users = getAllUsers().sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({ users });
}


