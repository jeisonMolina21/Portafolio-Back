import { NextRequest } from 'next/server';
import { PortfolioService } from '@/services/PortfolioService';
import { successResponse, errorResponse, unauthorizedResponse } from '@/constants/api-responses';
import { getAuthUser } from '@/lib/auth';
import { optionsResponse } from '@/lib/cors';
import pool from '@/lib/db';

export async function OPTIONS(req: NextRequest) {
  return optionsResponse(req.headers.get('origin'));
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const data = await PortfolioService.getEducation();
    return successResponse(data, origin);
  } catch (error: any) {
    return errorResponse('Error fetching education', 500, error.message, origin);
  }
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorizedResponse(origin);
    const body = await req.json();
    const id = await PortfolioService.addEducation(body);
    return successResponse({ id, message: 'Education added' }, origin);
  } catch (error: any) {
    return errorResponse('Error adding education', 500, error.message, origin);
  }
}

export async function PUT(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorizedResponse(origin);
    const body = await req.json();
    const { id, ...data } = body;
    await pool.query('UPDATE education SET institution = ?, degree = ?, period = ?, description = ? WHERE id = ?', [data.institution, data.degree, data.period, data.description, id]);

    return successResponse({ message: 'Education updated' }, origin);
  } catch (error: any) {
    return errorResponse('Error updating education', 500, error.message, origin);
  }
}

export async function DELETE(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorizedResponse(origin);
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return errorResponse('ID required', 400, null, origin);
    await PortfolioService.deleteEducation(parseInt(id));
    return successResponse({ message: 'Education deleted' }, origin);
  } catch (error: any) {
    return errorResponse('Error deleting education', 500, error.message, origin);
  }
}
