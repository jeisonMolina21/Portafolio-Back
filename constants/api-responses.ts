import { NextResponse } from 'next/server';
import { withCors } from '@/lib/cors';

export const successResponse = (data: any, origin: string | null) => {
  return withCors(NextResponse.json(data), origin);
};

export const errorResponse = (message: string, status: number = 500, details: any = null, origin: string | null = null) => {
  return withCors(
    NextResponse.json({ error: message, details }, { status }),
    origin
  );
};

export const unauthorizedResponse = (origin: string | null) => {
  return errorResponse('No autorizado', 401, null, origin);
};

export const validationErrorResponse = (details: any, origin: string | null) => {
  return errorResponse('Datos inválidos', 400, details, origin);
};
