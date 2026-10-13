import { NextRequest } from 'next/server';
import { ProfileController } from '@/controllers/ProfileController';
import { optionsResponse } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  return optionsResponse(req.headers.get('origin'));
}

export async function GET(req: NextRequest) {
  return ProfileController.getProfile(req);
}

export async function POST(req: NextRequest) {
  return ProfileController.updateProfile(req);
}


