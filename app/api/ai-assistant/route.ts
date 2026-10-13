import { NextRequest } from 'next/server';
import { withCors, optionsResponse } from '@/lib/cors';
import { successResponse, errorResponse } from '@/constants/api-responses';

export async function OPTIONS(req: NextRequest) {
  return optionsResponse(req.headers.get('origin'));
}

/**
 * AI Assistant & Automation Gateway Endpoint
 * Demo endpoint demonstrating AI Tool Calling & Multi-role Querying.
 */
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const body = await req.json();
    const { query, role } = body || {};

    if (!query) {
      return errorResponse('Missing query parameter in request body', 400, null, origin);
    }

    const lowerQuery = query.toLowerCase();
    let responseText = '';
    let matchedRole = role || 'general';

    if (lowerQuery.includes('fullstack') || lowerQuery.includes('react') || lowerQuery.includes('node') || lowerQuery.includes('backend')) {
      matchedRole = 'fullstack';
      responseText = `Jeison Molina se especializa en Desarrollo Fullstack con React, Node.js, Express, TypeScript y MySQL. Ha construido el Sistema de Carnetización Digital Institucional con arquitectura de API REST y control de acceso por roles.`;
    } else if (lowerQuery.includes('automatización') || lowerQuery.includes('python') || lowerQuery.includes('n8n') || lowerQuery.includes('bot')) {
      matchedRole = 'automation';
      responseText = `En el área de Automatización (RPA), Jeison ha desarrollado el Proyecto Kairós (procesamiento biométrico ZKTeco ahorrando 12 días manuales al mes) y el Proyecto Hermes (sincronización con Microsoft Graph API + n8n).`;
    } else if (lowerQuery.includes('soporte') || lowerQuery.includes('helpdesk') || lowerQuery.includes('tickets') || lowerQuery.includes('redes')) {
      matchedRole = 'helpdesk';
      responseText = `En Soporte TI y Mesa de Ayuda, Jeison gestiona incidencias N1/N2 en ServiceNow y Jira, administra cuentas en Microsoft 365 / Active Directory y realiza diagnóstico de redes y mantenimiento de hardware.`;
    } else {
      responseText = `Jeison Molina integra 3 perfiles profesionales: 1) Desarrollador Fullstack & Backend, 2) Especialista en Automatización de Procesos (RPA/Python/n8n), y 3) Soporte TI & Helpdesk Specialist.`;
    }

    return successResponse({
      query,
      matchedRole,
      answer: responseText,
      availableProfiles: ['fullstack', 'automation', 'helpdesk'],
      cvLinks: {
        fullstack: '/cv-fullstack.pdf',
        automation: '/cv-automation.pdf',
        helpdesk: '/cv-helpdesk.pdf'
      }
    }, origin);

  } catch (error: any) {
    return errorResponse('Error processing AI query', 500, error.message, origin);
  }
}
