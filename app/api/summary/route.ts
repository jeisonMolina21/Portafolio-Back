import { NextRequest } from 'next/server';
import { GatewayController } from '@/controllers/GatewayController';
import { optionsResponse } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  return optionsResponse(req.headers.get('origin'));
}

export async function GET(req: NextRequest) {
  return GatewayController.getSummary(req);
}


