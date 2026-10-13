import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { withCors, optionsResponse } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  return optionsResponse(origin);
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
  const origin = req.headers.get('origin');
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token || !verifyToken(token)) {
      return withCors(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), origin);
    }

    const { id } = await params;
    const body = await req.json();
    const { name, entity, date, image_url } = body;

    if (!name || !entity || !date) {
      return withCors(NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 }), origin);
    }

    await pool.query(
      'UPDATE recognitions SET name = ?, entity = ?, date = ?, image_url = ? WHERE id = ?',
      [name, entity, date, image_url ?? null, id]
    );

    return withCors(NextResponse.json({ message: 'Recognition updated successfully' }), origin);
  } catch (error: any) {
    console.error('Error updating recognition:', error);
    return withCors(NextResponse.json({ error: 'Error updating recognition', details: error.message }, { status: 500 }), origin);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
  const origin = req.headers.get('origin');
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token || !verifyToken(token)) {
      return withCors(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), origin);
    }

    const { id } = await params;
    await pool.query('DELETE FROM recognitions WHERE id = ?', [id]);
    return withCors(NextResponse.json({ message: 'Recognition deleted successfully' }), origin);
  } catch (error: any) {
    console.error('Error deleting recognition:', error);
    return withCors(NextResponse.json({ error: 'Error deleting recognition', details: error.message }, { status: 500 }), origin);
  }
}
