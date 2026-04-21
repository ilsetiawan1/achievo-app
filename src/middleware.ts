// src\middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];


  if (!token) {
    return NextResponse.json({ message: 'Akses ditolak, token tidak ada!' }, { status: 401 });
  }


  const decoded = await verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ message: 'Token tidak valid atau kedaluwarsa!' }, { status: 401 });
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/api/tasks/:path*', 
    '/api/user/:path*',
  ],
};
