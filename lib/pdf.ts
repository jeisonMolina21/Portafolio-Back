import PDFDocument from 'pdfkit';

/**
 * Generates an ATS-compliant PDF document buffer from the provided CV data structure.
 * 
 * @param cvData CV data structure containing profile, experience, projects, skills, education.
 * @returns Promise resolving to a Buffer of the generated PDF.
 */
export function buildAtsPdf(cvData: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: 54, bottom: 54, left: 54, right: 54 },
      bufferPages: true
    });

    const buffers: Buffer[] = [];
    doc.on('data', chunk => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', err => reject(err));

    const lang = cvData.lang || 'es';

    // Helper to check and handle page breaks to prevent orphans and coordinates glitching
    const checkPageBreak = (neededHeight: number) => {
      if (doc.y + neededHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
      }
    };

    // 1. Profile / Header Section
    const profile = cvData.profile || {};
    const fullName = profile.full_name || 'Jeison Molina';
    const title = profile.title || '';
    
    // Header Name (large, bold, centered)
    doc.font('Helvetica-Bold').fontSize(22).fillColor('#000000').text(fullName.toUpperCase(), { align: 'center' });
    doc.moveDown(0.2);

    // Headline / Role title (bold, centered)
    if (title) {
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#000000').text(title, { align: 'center' });
      doc.moveDown(0.3);
    }

    // Contact info line 1 (centered)
    const email = profile.email || 'andreyyeisonmg@gmail.com';
    const phone = profile.whatsapp || '+57 350 549 8014';
    const location = profile.location || 'Bogotá, Colombia';
    const contactLine1 = `${location} | Open to Remote LATAM/US | ${email} | ${phone}`;
    doc.font('Helvetica').fontSize(9).fillColor('#000000').text(contactLine1, { align: 'center' });
    doc.moveDown(0.15);

    // Contact info line 2: Portfolio (centered)
    const portfolioUrl = profile.portfolio_url || 'https://portafolio.markivo.site';
    const cleanPortfolioUrl = portfolioUrl.replace(/^https?:\/\/(www\.)?/, '');
    doc.font('Helvetica').fontSize(9).fillColor('#000000').text(`Portafolio: http://${cleanPortfolioUrl}`, { align: 'center' });
    doc.moveDown(0.15);

    // Contact info line 3: LinkedIn & GitHub (centered)
    const linkedin = profile.linkedin || 'https://linkedin.com/in/jeisonmolina';
    const github = profile.github || 'https://github.com/jeisonMolina21';
    const cleanLinkedin = linkedin.replace(/^https?:\/\/(www\.)?/, '');
    const cleanGithub = github.replace(/^https?:\/\/(www\.)?/, '');
    doc.font('Helvetica').fontSize(9).fillColor('#000000').text(`LinkedIn: ${cleanLinkedin} | GitHub: ${cleanGithub}`, { align: 'center' });
    doc.moveDown(0.5);

    // Helper for Section Headers (double horizontal borders, centered title)
    const drawSectionHeader = (titleText: string) => {
      checkPageBreak(50);
      doc.moveDown(0.5);
      const yAbove = doc.y;
      doc.moveTo(54, yAbove).lineTo(612 - 54, yAbove).strokeColor('#000000').lineWidth(0.8).stroke();
      doc.moveDown(0.35);
      
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#000000').text(titleText.toUpperCase(), { align: 'center' });
      doc.moveDown(0.25);
      
      const yBelow = doc.y;
      doc.moveTo(54, yBelow).lineTo(612 - 54, yBelow).strokeColor('#000000').lineWidth(0.8).stroke();
      doc.moveDown(0.6);
    };

    // 2. Summary / Bio
    const bio = profile.bio || profile.bio_es || '';
    if (bio) {
      const summaryHeader = lang === 'en' ? 'Professional Summary' : 'Resumen Profesional';
      drawSectionHeader(summaryHeader);
      doc.font('Helvetica').fontSize(9.5).fillColor('#000000').text(bio, { align: 'justify', lineGap: 2 });
      doc.moveDown(0.6);
    }

    // 3. Experience
    const experiences = cvData.experience || [];
    if (experiences.length > 0) {
      const expHeader = lang === 'en' ? 'Professional Experience' : 'Experiencia Profesional';
      drawSectionHeader(expHeader);

      experiences.forEach((exp: any) => {
        // Enforce page break check before printing an experience block
        checkPageBreak(85);
        
        const company = exp.company || '';
        const period = exp.period || '';
        const role = exp.role || '';
        
        // Print Company (left) and Period (right) on the same line
        const yStart = doc.y;
        doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#000000').text(company, 54, yStart);
        doc.font('Helvetica').fontSize(9.5).fillColor('#000000').text(period, 54, yStart, { align: 'right' });
        
        // Space down to role title line
        doc.y = yStart + 14;
        
        // Print Role (left)
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text(role, 54, doc.y);
        doc.moveDown(0.4);

        // Print Description as custom dash-bullet list
        const desc = exp.description || '';
        if (desc) {
          const lines = desc.split('\n').map(l => l.trim()).filter(Boolean);
          lines.forEach(line => {
            checkPageBreak(25); // Ensure individual bullets don't orphan awkwardly
            const cleanLine = line.startsWith('-') ? line.substring(1).trim() : line;
            const currentY = doc.y;
            
            doc.font('Helvetica').fontSize(9.5).fillColor('#000000');
            doc.text('-', 64, currentY);
            doc.text(cleanLine, 76, currentY, { width: 612 - 54 - 76, align: 'justify', lineGap: 1.5 });
            doc.moveDown(0.25);
          });
        }

        doc.moveDown(0.65);
      });
    }

    // 4. Skills
    const skills = cvData.skills || [];
    if (skills.length > 0) {
      const skillsHeader = lang === 'en' ? 'Technical Skills' : 'Habilidades Técnicas';
      drawSectionHeader(skillsHeader);

      if (typeof skills[0] === 'object') {
        const categories: Record<string, string[]> = {};
        skills.forEach((s: any) => {
          const cat = s.category || 'General';
          if (!categories[cat]) categories[cat] = [];
          categories[cat].push(s.name || s.skill);
        });

        Object.keys(categories).forEach(cat => {
          checkPageBreak(25);
          doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text(cat + ': ', { continued: true });
          doc.font('Helvetica').fontSize(9.5).fillColor('#000000').text(categories[cat].join(', '));
          doc.moveDown(0.4);
        });
      } else {
        doc.font('Helvetica').fontSize(9.5).fillColor('#000000').text(skills.join(', '), { align: 'justify' });
      }
      doc.moveDown(0.4);
    }

    // 5. Education
    const education = cvData.education || [];
    if (education.length > 0) {
      const eduHeader = lang === 'en' ? 'Education' : 'Educación';
      drawSectionHeader(eduHeader);

      education.forEach((edu: any) => {
        checkPageBreak(45);
        
        const inst = edu.institution || '';
        const degree = edu.degree || '';
        const period = edu.period || '';

        const yStart = doc.y;
        doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#000000').text(inst, 54, yStart);
        doc.font('Helvetica').fontSize(9.5).fillColor('#000000').text(period, 54, yStart, { align: 'right' });

        doc.y = yStart + 14;
        doc.font('Helvetica-Oblique').fontSize(9.5).fillColor('#000000').text(degree, 54, doc.y);
        doc.moveDown(0.65);
      });
    }

    // 6. Projects
    const projects = cvData.projects || [];
    if (projects.length > 0) {
      const projHeader = lang === 'en' ? 'Key Projects' : 'Proyectos Destacados';
      drawSectionHeader(projHeader);

      projects.forEach((proj: any) => {
        checkPageBreak(65);
        
        const title = proj.title || '';
        const stack = proj.tech_stack || '';
        const desc = proj.description || '';

        // Project Title
        doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#000000').text(title);
        
        // Tech stack
        if (stack) {
          doc.font('Helvetica-Oblique').fontSize(9).fillColor('#333333').text(`Stack: ${stack}`);
        }
        doc.moveDown(0.2);

        // Description
        if (desc) {
          doc.font('Helvetica').fontSize(9.5).fillColor('#000000').text(desc, { align: 'justify', lineGap: 1.5 });
        }

        doc.moveDown(0.65);
      });
    }

    // End document
    doc.end();
  });
}
