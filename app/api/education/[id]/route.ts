import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { EducationSchema } from '@/lib/schemas';
import { validateData } from '@/lib/validation';
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
    const { isValid, data, response } = await validateData(EducationSchema, body);
    if (!isValid) return withCors(response!, origin);

    const { institution, degree, period, description } = data!;

    await pool.query(
      'UPDATE education SET institution = ?, degree = ?, period = ?, description = ? WHERE id = ?',
      [institution, degree, period, description ?? null, id]
    );

    return withCors(NextResponse.json({ message: 'Education updated successfully' }), origin);
  } catch (error: any) {
    console.error('Error updating education:', error);
    return withCors(NextResponse.json({ error: 'Error updating education' }, { status: 500 }), origin);
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
    await pool.query('DELETE FROM education WHERE id = ?', [id]);
    return withCors(NextResponse.json({ message: 'Education deleted' }), origin);
  } catch (error: any) {
    console.error('Error deleting education:', error);
    return withCors(NextResponse.json({ error: 'Error deleting education' }, { status: 500 }), origin);
  }
}
