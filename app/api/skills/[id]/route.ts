import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { withCors, optionsResponse } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  return optionsResponse(origin);
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
  const origin = req.headers.get('origin');
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token || !verifyToken(token)) {
      return withCors(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), origin);
    }

    const { id } = await params;
    await pool.query('DELETE FROM skills WHERE id = ?', [id]);
    return withCors(NextResponse.json({ message: 'Skill deleted' }), origin);
  } catch (error: any) {
    console.error('Error deleting skill:', error);
    return withCors(NextResponse.json({ error: 'Error deleting skill' }, { status: 500 }), origin);
  }
}
