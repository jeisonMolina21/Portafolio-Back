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
    const data = await PortfolioService.getExperience();
    return successResponse(data, origin);
  } catch (error: any) {
    return errorResponse('Error fetching experience', 500, error.message, origin);
  }
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorizedResponse(origin);
    const body = await req.json();
    const id = await PortfolioService.addExperience(body);
    return successResponse({ id, message: 'Experience added' }, origin);
  } catch (error: any) {
    return errorResponse('Error adding experience', 500, error.message, origin);
  }
}

export async function PUT(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorizedResponse(origin);
    const body = await req.json();
    const { id, ...data } = body;
    await pool.query('UPDATE experience SET company = ?, role = ?, period = ?, description = ?, skills = ? WHERE id = ?', [data.company, data.role, data.period, data.description, data.skills, id]);

    return successResponse({ message: 'Experience updated' }, origin);
  } catch (error: any) {
    return errorResponse('Error updating experience', 500, error.message, origin);
  }
}

export async function DELETE(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorizedResponse(origin);
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return errorResponse('ID required', 400, null, origin);
    await PortfolioService.deleteExperience(parseInt(id));
    return successResponse({ message: 'Experience deleted' }, origin);
  } catch (error: any) {
    return errorResponse('Error deleting experience', 500, error.message, origin);
  }
}
