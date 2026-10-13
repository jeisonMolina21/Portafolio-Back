import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { MessageSchema } from '@/lib/schemas';
import { validateData } from '@/lib/validation';
import { withCors, optionsResponse } from '@/lib/cors';
import { unauthorizedResponse } from '@/constants/api-responses';

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  return optionsResponse(origin);
}

/**
 * GET: Fetch all messages (Protected)
 */
export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
  const user = getAuthUser(req);
  if (!user) return unauthorizedResponse(origin);

  try {
    const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    return withCors(NextResponse.json(rows), origin);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return withCors(NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 }), origin);
  }
}

/**
 * POST: Save a new message (Public)
 */
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const body = await req.json();
    const { isValid, data, response } = await validateData(MessageSchema, body);
    if (!isValid) return withCors(response!, origin);

    const { name, phone, whatsapp, city, message } = data!;

    await pool.query(
      'INSERT INTO messages (name, phone, whatsapp, city, message) VALUES (?, ?, ?, ?, ?)',
      [name, phone ?? null, whatsapp ?? null, city ?? null, message]
    );

    return withCors(NextResponse.json({ message: 'Mensaje enviado con éxito' }, { status: 201 }), origin);
  } catch (error: any) {
    console.error('Error saving message:', error);
    return withCors(NextResponse.json({ error: 'Error al enviar mensaje' }, { status: 500 }), origin);
  }
}

/**
 * DELETE: Remove a message (Protected)
 */
export async function DELETE(req: NextRequest) {
  const origin = req.headers.get('origin');
  const user = getAuthUser(req);
  if (!user) return unauthorizedResponse(origin);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return withCors(NextResponse.json({ error: 'ID requerido' }, { status: 400 }), origin);

  try {
    await pool.query('DELETE FROM messages WHERE id = ?', [id]);
    return withCors(NextResponse.json({ message: 'Mensaje eliminado' }), origin);
  } catch (error: any) {
    console.error('Error deleting message:', error);
    return withCors(NextResponse.json({ error: 'Error al eliminar mensaje' }, { status: 500 }), origin);
  }
}
