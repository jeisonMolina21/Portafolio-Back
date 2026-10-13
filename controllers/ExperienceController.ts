import { NextRequest } from 'next/server';
import { ExperienceModel } from '@/models/ExperienceModel';
import { getAuthUser } from '@/lib/auth';
import { translate } from '@/lib/translator';
import { ExperienceSchema } from '@/lib/schemas';
import { validateData } from '@/lib/validation';
import { successResponse, errorResponse, unauthorizedResponse } from '@/constants/api-responses';
import { withCors } from '@/lib/cors';

export class ExperienceController {
  static async getExperiences(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
      const { searchParams } = new URL(req.url);
      const lang = searchParams.get('lang') || 'es';
      const rows = await ExperienceModel.getAll();

      const processedRows = await Promise.all(rows.map(async (row: any) => ({
        ...row,
        role: await translate(row.role, lang),
        description: await translate(row.description, lang),
        skills: await translate(row.skills, lang),
      })));

      return successResponse(processedRows, origin);
    } catch (error: any) {
      return errorResponse('Error al obtener la experiencia', 500, error.message, origin);
    }
  }

  static async createExperience(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
      const user = getAuthUser(req);
      if (!user) return unauthorizedResponse(origin);

      const body = await req.json();
      const { isValid, data, response } = await validateData(ExperienceSchema, body);
      if (!isValid) return withCors(response!, origin);

      const id = await ExperienceModel.create(data!);

      return successResponse({ id, message: 'Experiencia agregada exitosamente' }, origin);
    } catch (error: any) {
      return errorResponse('Error al agregar la experiencia', 500, error.message, origin);
    }
  }
}
