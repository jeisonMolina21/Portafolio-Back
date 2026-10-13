import { NextRequest } from 'next/server';
import { PortfolioService } from '@/services/PortfolioService';
import { successResponse, errorResponse, unauthorizedResponse } from '@/constants/api-responses';
import { getAuthUser } from '@/lib/auth';
import { optionsResponse } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  return optionsResponse(req.headers.get('origin'));
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const data = await PortfolioService.getProjects();
    return successResponse(data, origin);
  } catch (error: any) {
    return errorResponse('Error fetching projects', 500, error.message, origin);
  }
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorizedResponse(origin);
    const body = await req.json();
    const id = await PortfolioService.addProject(body);
    return successResponse({ id, message: 'Project added' }, origin);
  } catch (error: any) {
    return errorResponse('Error adding project', 500, error.message, origin);
  }
}
