import { NextRequest } from 'next/server';
import { ProfileController } from '@/controllers/ProfileController';
import { optionsResponse } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  return optionsResponse(req.headers.get('origin'));
}

export async function PUT(req: NextRequest) {
  return ProfileController.updateProfile(req);
}
