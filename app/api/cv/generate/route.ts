import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '@/services/PortfolioService';
import { errorResponse } from '@/constants/api-responses';
import { optionsResponse } from '@/lib/cors';
import { buildAtsPdf } from '@/lib/pdf';

// Simple API Key security to prevent unauthorized access
const API_KEY = process.env.API_KEY || 'n8n_secure_api_key_2026';

export async function OPTIONS(req: NextRequest) {
  return optionsResponse(req.headers.get('origin'));
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  
  // 1. Authenticate Request
  const apiKeyHeader = req.headers.get('x-api-key') || req.nextUrl.searchParams.get('key');
  if (apiKeyHeader !== API_KEY) {
    return new NextResponse('Unauthorized: Invalid API Key', { 
      status: 401,
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const lang = body.lang || 'es';

    // 2. Fetch baseline data from DB (to fill in missing fields)
    const baseSummary = await PortfolioService.getFullSummary(lang);

    // 3. Merge request payload over base summary data
    const mergedData = {
      lang,
      profile: {
        ...baseSummary.profile,
        ...(body.profile || {})
      },
      experience: body.experience || baseSummary.experience,
      skills: body.skills || baseSummary.skills,
      projects: body.projects || baseSummary.projects,
      education: body.education || baseSummary.education
    };

    // 4. Generate the ATS-compliant PDF
    const pdfBuffer = await buildAtsPdf(mergedData);

    // 5. Send PDF response
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="cv-${lang}.pdf"`,
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    });

  } catch (error: any) {
    console.error('Error generating dynamic CV:', error);
    return errorResponse('Error generating dynamic CV', 500, error.message, origin);
  }
}
