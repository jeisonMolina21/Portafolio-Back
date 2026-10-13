import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/AuthService';
import { LoginSchema } from '@/lib/schemas';
import { validateData } from '@/lib/validation';
import { withCors, optionsResponse } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  return optionsResponse(origin);
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const body = await req.json();
    const { isValid, data, response } = await validateData(LoginSchema, body);
    if (!isValid) return withCors(response!, origin);

    const { username, password } = data!;
    
    // Delegamos la autenticación al servicio
    const result = await AuthService.login(username, password);

    return withCors(NextResponse.json({
      message: 'Login exitoso',
      ...result
    }), origin);

  } catch (error: any) {
    const status = error.message === 'Credenciales inválidas' ? 401 : 500;
    return withCors(NextResponse.json({ error: error.message }, { status }), origin);
  }
}
