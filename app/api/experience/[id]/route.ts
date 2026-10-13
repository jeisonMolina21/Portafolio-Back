import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ExperienceSchema } from '@/lib/schemas';
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
    const { isValid, data, response } = await validateData(ExperienceSchema, body);
    if (!isValid) return withCors(response!, origin);

    const { company, role, period, description, skills, location } = data!;

    await pool.query(
      'UPDATE experience SET company = ?, role = ?, period = ?, description = ?, skills = ?, location = ? WHERE id = ?',
      [company, role, period, description, skills, location ?? null, id]
    );

    return withCors(NextResponse.json({ message: 'Experience updated successfully' }), origin);
  } catch (error: any) {
    console.error('Error updating experience:', error);
    return withCors(NextResponse.json({ error: 'Error updating experience' }, { status: 500 }), origin);
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
    await pool.query('DELETE FROM experience WHERE id = ?', [id]);
    return withCors(NextResponse.json({ message: 'Experience deleted' }), origin);
  } catch (error: any) {
    console.error('Error deleting experience:', error);
    return withCors(NextResponse.json({ error: 'Error deleting experience' }, { status: 500 }), origin);
  }
}
