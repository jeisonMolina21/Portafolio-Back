import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withCors, optionsResponse } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  return optionsResponse(req.headers.get('origin'));
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    // Intentamos una consulta simple a la DB
    await pool.query('SELECT 1');
    
    return withCors(NextResponse.json({ 
      status: 'ok', 
      database: 'connected',
      message: 'Backend está respondiendo correctamente'
    }), origin);
    
  } catch (error: any) {
    return withCors(NextResponse.json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message 
    }, { status: 500 }), origin);
  }
}
