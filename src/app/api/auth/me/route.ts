// src\app\api\auth\me\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    const decoded = await verifyToken(token!);

    if (!decoded || !decoded.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // AMBIL DATA TERBARU DARI DATABASE
    const user = await User.find(new ObjectId(decoded.id as string));

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Kirim data lengkap (tanpa password tentunya!)
    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        total_exp: user.total_exp || 0,
        level: user.level || 1,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('ERROR:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
