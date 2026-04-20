// src\app\api\auth\login\route.ts

import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await User.where('email', email).first();

    if (!user || !user.password) {
      return NextResponse.json({ message: 'Email atau password salah!' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Email atau password salah!' }, { status: 401 });
    }

    const token = await generateToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    });

    return NextResponse.json({
      message: 'Login berhasil!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('LOGIN_ERROR:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
