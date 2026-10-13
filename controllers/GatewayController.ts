import { NextRequest } from 'next/server';
import { PortfolioService } from '@/services/PortfolioService';
import { successResponse, errorResponse } from '@/constants/api-responses';

export class GatewayController {
  /**
   * Endpoint principal para obtener el resumen del portafolio.
   */
  static async getSummary(req: NextRequest) {
    const origin = req.headers.get('origin');
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'es';

    try {
      // Delegamos toda la lógica pesada a la capa de servicio
      const summary = await PortfolioService.getFullSummary(lang);
      return successResponse(summary, origin);

    } catch (error: any) {
      console.error('🚀 [Gateway Error]:', error);
      return errorResponse('Error al sincronizar el portafolio', 500, error.message, origin);
    }
  }
}
