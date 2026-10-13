import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '@/services/PortfolioService';
import { optionsResponse } from '@/lib/cors';
import { buildAtsPdf } from '@/lib/pdf';
import { ProfileModel } from '@/models/ProfileModel';
import { ExperienceModel } from '@/models/ExperienceModel';
import { ProjectModel } from '@/models/ProjectModel';
import { EducationModel } from '@/models/EducationModel';
import pool from '@/lib/db';

export async function OPTIONS(req: NextRequest) {
  return optionsResponse(req.headers.get('origin'));
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
  
  try {
    const { searchParams } = req.nextUrl;
    const lang = (searchParams.get('lang') || 'es').toLowerCase();
    const role = (searchParams.get('role') || 'fullstack').toLowerCase();

    const targetLang = (lang === 'en' || lang === 'es') ? lang : 'es';

    // 1. Select profile ID and experience keyword based on targeted role
    let profileId = 1;
    let roleKeyword = 'fullstack';

    if (role === 'automation' || role === 'automatizaciones' || role === 'automatizacion') {
      profileId = 2;
      roleKeyword = 'automation';
    } else if (role === 'helpdesk' || role === 'soporte' || role === 'support') {
      profileId = 3;
      roleKeyword = 'helpdesk';
    }

    // 2. Fetch the role-specific profile settings from DB
    const profileRaw = await ProfileModel.getById(profileId);
    if (!profileRaw) {
      return new NextResponse(`Profile not found for ID ${profileId}`, { status: 404 });
    }
    
    // Process profile translations (processes metrics, localized title, bio, etc.)
    // We cast to any to call processProfile which is private, or we can use it directly
    const profile = await (PortfolioService as any).processProfile(profileRaw, targetLang);

    // 3. Fetch experiences from DB and filter down to exactly 1 (the latest Horizonte one tailored to the role)
    const experiencesAll = await ExperienceModel.getAll(targetLang);
    const experiences = experiencesAll.filter((exp: any) => {
      // Keep only the latest experience (Fundación Universitaria Horizonte) matching the role keyword
      if (exp.company === 'Fundación Universitaria Horizonte') {
        const roleLower = exp.role.toLowerCase();
        if (roleKeyword === 'fullstack') {
          return roleLower.includes('full stack') || roleLower.includes('fullstack');
        }
        if (roleKeyword === 'automation') {
          return roleLower.includes('automatización') || roleLower.includes('automation');
        }
        if (roleKeyword === 'helpdesk') {
          return roleLower.includes('soporte') || roleLower.includes('helpdesk');
        }
      }
      return false;
    });

    // 4. Fetch skills and projects dynamically from DB
    const [ [skillRows], educationRows, projectsAll ]: any = await Promise.all([
      pool.query('SELECT * FROM skills ORDER BY name ASC'),
      EducationModel.getAll(),
      ProjectModel.getAll()
    ]);

    // Format skills and projects
    const education = await (PortfolioService as any).processEducation(educationRows, targetLang);
    const projects = await (PortfolioService as any).processProjects(projectsAll, targetLang);
    const skills = skillRows;

    // 5. Merge data
    const mergedData = {
      lang: targetLang,
      profile,
      experience: experiences,
      skills,
      projects,
      education
    };

    // 6. Generate PDF Buffer
    const pdfBuffer = await buildAtsPdf(mergedData);

    // 7. Return PDF Response
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="CV_Jeison_Molina_${roleKeyword}_${targetLang}.pdf"`,
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    });

  } catch (error: any) {
    console.error('Error serving dynamic CV PDF:', error);
    return new NextResponse('Internal Server Error: ' + error.message, { status: 500 });
  }
}
