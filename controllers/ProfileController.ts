import { NextRequest } from 'next/server';
import { ProfileModel } from '@/models/ProfileModel';
import { getAuthUser } from '@/lib/auth';
import { translate } from '@/lib/translator';
import { ProfileSchema } from '@/lib/schemas';
import { validateData } from '@/lib/validation';
import { successResponse, errorResponse, unauthorizedResponse } from '@/constants/api-responses';
import { localizeObject } from '@/constants/languages';
import { withCors } from '@/lib/cors';

export class ProfileController {
  static async getProfile(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
      const { searchParams } = new URL(req.url);
      const lang = searchParams.get('lang') || 'es';
      
      let profile = await ProfileModel.getById(1);

      if (profile) {
        profile = localizeObject(profile, ['title', 'bio'], lang);
        if (!profile.title && profile.title_es) profile.title = await translate(profile.title_es, lang);
        if (!profile.bio && profile.bio_es) profile.bio = await translate(profile.bio_es, lang);
      }

      return successResponse(profile, origin);
    } catch (error: any) {
      return errorResponse('Error al obtener el perfil', 500, error.message, origin);
    }
  }

  static async updateProfile(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
      const user = getAuthUser(req);
      if (!user) return unauthorizedResponse(origin);

      const body = await req.json();
      const { isValid, data, response } = await validateData(ProfileSchema, body);
      if (!isValid) return withCors(response!, origin);

      await ProfileModel.update(1, data!);

      return successResponse({ message: 'Perfil actualizado exitosamente' }, origin);
    } catch (error: any) {
      return errorResponse('Error al actualizar el perfil', 500, error.message, origin);
    }
  }
}
