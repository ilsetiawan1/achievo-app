// src\app\api\auth\register\route.ts

import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Semua data (nama, email, password) wajib diisi!' }, { status: 400 });
    }

    const existingUser = await User.where('email', email).first();
    if (existingUser) {
      return NextResponse.json({ message: 'Email sudah terdaftar, silakan gunakan email lain.' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      total_exp: 0,
      level: 1,
    });

    const token = await generateToken({
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
    });

    return NextResponse.json(
      {
        message: 'Registrasi berhasil!',
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('REGISTER_ERROR:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}


