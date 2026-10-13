import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { SkillSchema } from '@/lib/schemas';
import { validateData } from '@/lib/validation';
import { withCors, optionsResponse } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  return optionsResponse(origin);
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const [rows] = await pool.query('SELECT * FROM skills ORDER BY name ASC');
    return withCors(NextResponse.json(rows), origin);
  } catch (error: any) {
    console.error('Error fetching skills:', error);
    return withCors(NextResponse.json({ error: 'Error fetching skills' }, { status: 500 }), origin);
  }
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token || !verifyToken(token)) {
      return withCors(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), origin);
    }

    const body = await req.json();
    const { isValid, data, response } = await validateData(SkillSchema, body);
    if (!isValid) return withCors(response!, origin);

    const { name, category, level } = data!;
    await pool.query('INSERT IGNORE INTO skills (name, category, level) VALUES (?, ?, ?)', [name, category ?? null, level ?? null]);

    return withCors(NextResponse.json({ message: 'Skill added successfully' }, { status: 201 }), origin);
  } catch (error: any) {
    console.error('Error adding skill:', error);
    return withCors(NextResponse.json({ error: 'Error adding skill' }, { status: 500 }), origin);
  }
}
