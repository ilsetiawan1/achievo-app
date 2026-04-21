// src\app\api\tasks\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Task } from '@/models/Task';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    const decoded = await verifyToken(token!);

    if (!decoded || !decoded.id) {
      return NextResponse.json({ message: 'User tidak terautentikasi' }, { status: 401 });
    }

    const { title, description, category, start_time, end_time, exp_earned } = await req.json();

    const newTask = await Task.create({
      user_id: new ObjectId(decoded.id as string),
      title,
      description,
      category,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      is_completed: false,
      exp_earned: exp_earned || 10,
    });

    return NextResponse.json({ message: 'Berhasil menambahkan data task', newTask }, { status: 201 });
  } catch (error) {
    console.error('ERROR_POST_TASK:', error);
    return NextResponse.json({ message: 'Aduh error bro' }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    const decoded = await verifyToken(token!);

    if (!decoded || !decoded.id) {
      return NextResponse.json({ message: 'Akses ditolak' }, { status: 401 });
    }

    const tasks = await Task.where('user_id', new ObjectId(decoded.id as string))
      .orderBy('createdAt', 'desc') 
      .get();

    return NextResponse.json(
      {
        message: 'Berhasil mengambil daftar tugas',
        tasks,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('ERROR_GET_TASKS:', error);
    return NextResponse.json({ message: 'Gagal ambil data bro' }, { status: 500 });
  }
}
