// src\app\api\tasks\[id]\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Task } from '@/models/Task';
import { User } from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';


interface RouteContext {
  params: Promise<{ id: string }>; 
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const {id} = await context.params;
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    const decoded = await verifyToken(token!);

    if (!decoded || !decoded.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const task = (await Task.where('_id', new ObjectId(id))
      .where('user_id', new ObjectId(decoded.id as string))
      .first()) as unknown as Task;

    if (!task) return NextResponse.json({ message: 'Task tidak ditemukan' }, { status: 404 });

    if (body.is_completed === true && task.is_completed === false) {
      const user = (await User.find(new ObjectId(decoded.id as string))) as unknown as User;
      if (user) {
        await user.update({
          total_exp: (user.total_exp || 0) + (task.exp_earned || 10),
        });
      }
    }

    await task.update(body);

    return NextResponse.json({ message: 'Task updated!', task }, { status: 200 });

  } catch (error) {
    console.error('PATCH_ERROR:', error);
    return NextResponse.json({ message: 'Error patch' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const {id} = await context.params;
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    const decoded = await verifyToken(token!);

    if (!decoded || !decoded.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const task = (await Task.where('_id', new ObjectId(id))
      .where('user_id', new ObjectId(decoded.id as string))
      .first()) as unknown as Task;

    if (!task) return NextResponse.json({ message: 'Task tidak ditemukan' }, { status: 404 });

    await task.delete();
    return NextResponse.json({ message: 'Task berhasil dihapus (Soft Delete)' }, { status: 200 });
  } catch (error) {
    console.error('DELETE_ERROR:', error);
    return NextResponse.json({ message: 'Error delete' }, { status: 500 });
  }
}