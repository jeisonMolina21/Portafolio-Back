import { NextResponse } from 'next/server';
import { ZodSchema } from 'zod';

export async function validateData<T>(schema: ZodSchema<T>, data: any): Promise<{ isValid: boolean; data?: T; response?: NextResponse }> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }));
    return {
      isValid: false,
      response: NextResponse.json({ 
        error: 'Error de validación', 
        details: errors 
      }, { status: 400 })
    };
  }
  return { isValid: true, data: result.data };
}
