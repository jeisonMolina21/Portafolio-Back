const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Redesigned standalone PDF Generator using PDFKit with Page Break Management
function buildPdfBuffer(cvData) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: 54, bottom: 54, left: 54, right: 54 },
      bufferPages: true
    });

    const buffers = [];
    doc.on('data', chunk => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', err => reject(err));

    const lang = cvData.lang || 'es';
    const profile = cvData.profile || {};
    const fullName = profile.full_name || 'Jeison Molina';
    const title = profile.title || '';

    // Page Break Utility
    const checkPageBreak = (neededHeight) => {
      if (doc.y + neededHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
      }
    };

    // Header Name
    doc.font('Helvetica-Bold').fontSize(22).fillColor('#000000').text(fullName.toUpperCase(), { align: 'center' });
    doc.moveDown(0.2);

    // Headline
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

    // Contact info line 2 (centered)
    const portfolioUrl = profile.portfolio_url || 'http://jeison-molina-portafolio.vercel.app';
    const cleanPortfolio = portfolioUrl.replace(/^https?:\/\/(www\.)?/, '');
    doc.font('Helvetica').fontSize(9).fillColor('#000000').text(`Portafolio: http://${cleanPortfolio}`, { align: 'center' });
    doc.moveDown(0.15);

    // Contact info line 3 (centered)
    const linkedin = profile.linkedin || 'https://linkedin.com/in/jeisonmolina';
    const github = profile.github || 'https://github.com/jeisonMolina21';
    const cleanLinkedin = linkedin.replace(/^https?:\/\/(www\.)?/, '');
    const cleanGithub = github.replace(/^https?:\/\/(www\.)?/, '');
    doc.font('Helvetica').fontSize(9).fillColor('#000000').text(`LinkedIn: ${cleanLinkedin} | GitHub: ${cleanGithub}`, { align: 'center' });
    doc.moveDown(0.5);

    // Helper for Section Headers
    const drawSectionHeader = (titleText) => {
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

    // Bio
    const bio = profile.bio || '';
    if (bio) {
      const summaryHeader = lang === 'en' ? 'Professional Summary' : 'Resumen Profesional';
      drawSectionHeader(summaryHeader);
      doc.font('Helvetica').fontSize(9.5).fillColor('#000000').text(bio, { align: 'justify', lineGap: 2 });
      doc.moveDown(0.6);
    }

    // Experience
    const experiences = cvData.experience || [];
    if (experiences.length > 0) {
      const expHeader = lang === 'en' ? 'Professional Experience' : 'Experiencia Profesional';
      drawSectionHeader(expHeader);
      experiences.forEach(exp => {
        checkPageBreak(85);
        
        const company = exp.company || '';
        const period = exp.period || '';
        const role = exp.role || '';

        const yStart = doc.y;
        doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#000000').text(company, 54, yStart);
        doc.font('Helvetica').fontSize(9.5).fillColor('#000000').text(period, 54, yStart, { align: 'right' });

        doc.y = yStart + 14;
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text(role, 54, doc.y);
        doc.moveDown(0.4);

        const desc = exp.description || '';
        if (desc) {
          const lines = desc.split('\n').map(l => l.trim()).filter(Boolean);
          lines.forEach(line => {
            checkPageBreak(25);
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

    // Skills
    const skills = cvData.skills || [];
    if (skills.length > 0) {
      const skillsHeader = lang === 'en' ? 'Technical Skills' : 'Habilidades Técnicas';
      drawSectionHeader(skillsHeader);
      const categories = {};
      skills.forEach(s => {
        const cat = s.category || 'General';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(s.name);
      });
      Object.keys(categories).forEach(cat => {
        checkPageBreak(25);
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000').text(cat + ': ', { continued: true });
        doc.font('Helvetica').fontSize(9.5).fillColor('#000000').text(categories[cat].join(', '));
        doc.moveDown(0.4);
      });
      doc.moveDown(0.4);
    }

    // Education
    const education = cvData.education || [];
    if (education.length > 0) {
      const eduHeader = lang === 'en' ? 'Education' : 'Educación';
      drawSectionHeader(eduHeader);
      education.forEach(edu => {
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

    // Projects
    const projects = cvData.projects || [];
    if (projects.length > 0) {
      const projHeader = lang === 'en' ? 'Key Projects' : 'Proyectos Destacados';
      drawSectionHeader(projHeader);
      projects.forEach(proj => {
        checkPageBreak(65);
        
        const title = proj.title || '';
        const stack = proj.tech_stack || '';
        const desc = proj.description || '';

        doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#000000').text(title);
        if (stack) {
          doc.font('Helvetica-Oblique').fontSize(9).fillColor('#333333').text(`Stack: ${stack}`);
        }
        doc.moveDown(0.2);
        if (desc) {
          doc.font('Helvetica').fontSize(9.5).fillColor('#000000').text(desc, { align: 'justify', lineGap: 1.5 });
        }
        doc.moveDown(0.65);
      });
    }

    doc.end();
  });
}

// Role targeted copy for static PDFs
const staticRoleCvData = {
  fullstack: {
    title: 'Desarrollador Full Stack | Node.js, React & SQL / NoSQL',
    bio: 'Desarrollador Full Stack con 2.5 años de experiencia diseñando e implementando aplicaciones web y arquitecturas REST API escalables. Especializado en Next.js, React, Node.js (Express) y bases de datos (PostgreSQL, MySQL, SQL Server), con un enfoque en interfaces de usuario intuitivas y optimización del rendimiento del lado del servidor.',
    skills: [
      { name: 'JavaScript (ES6+)', category: 'Lenguajes' },
      { name: 'TypeScript', category: 'Lenguajes' },
      { name: 'Python', category: 'Lenguajes' },
      { name: 'SQL', category: 'Lenguajes' },
      { name: 'HTML5 / CSS3', category: 'Frontend' },
      { name: 'React', category: 'Frontend' },
      { name: 'Next.js 14/15', category: 'Frontend' },
      { name: 'Astro', category: 'Frontend' },
      { name: 'Tailwind CSS', category: 'Frontend' },
      { name: 'Node.js (Express)', category: 'Backend' },
      { name: 'REST APIs', category: 'Backend' },
      { name: 'JWT & OAuth2', category: 'Backend' },
      { name: 'PostgreSQL', category: 'Bases de Datos' },
      { name: 'MySQL / MariaDB', category: 'Bases de Datos' },
      { name: 'SQL Server', category: 'Bases de Datos' },
      { name: 'Docker', category: 'DevOps & Tools' },
      { name: 'Git & GitHub', category: 'DevOps & Tools' },
      { name: 'Linux System Admin', category: 'DevOps & Tools' }
    ],
    experience: [
      {
        company: 'Fundación Universitaria Horizonte',
        role: 'Full Stack Developer (Auxiliar de Tecnología)',
        period: 'Julio 2025 – Actualidad',
        description: `- Diseñé e implementé la arquitectura integral del Sistema de Carnetización Digital (Base de Datos PostgreSQL/MySQL, Backend Node.js/Express y Frontend React).
- Desarrollé APIs REST seguras con autenticación JWT y autorización basada en roles (RBAC) para el personal administrativo y estudiantil.
- Autoprovisioné cuentas y sincronicé identidades de más de 500 usuarios integrando servicios de Microsoft Graph API y Azure Active Directory.
- Optimicé procesos del backend e integré vistas de bases de datos reduciendo la latencia de consultas críticas en un 40%.`
      },
      {
        company: 'Freelance',
        role: 'Full Stack Developer & Backend Developer',
        period: 'Abril 2024 – Actualidad',
        description: `- Desarrollo de un SaaS E-commerce Multi-Tenant con Next.js 14, React y SQL Server, integrando pasarelas de pago y facturación electrónica DIAN.
- Diseñé y optimicé bases de datos relacionales, creando índices y refinando procedimientos almacenados que aumentaron la velocidad de extracción de datos en un 60%.
- Implementación de flujos de autenticación OAuth 2.0 y servicios backend rápidos con Node.js y TypeScript.`
      },
      {
        company: 'Gi Group',
        role: 'Software Developer (Integrations & Automation)',
        period: 'Octubre 2023 – Marzo 2024',
        description: `- Desarrollo de scripts de integración en Python y bases de datos relacionales para optimizar la carga y sincronización de datos empresariales.
- Optimización de scripts de backend con un manejo robusto de logs de errores, aumentando la estabilidad del procesamiento en un 30%.`
      }
    ],
    projects: [
      {
        title: 'Marketify: SaaS E-commerce Multi-Tenant',
        tech_stack: 'Node.js, Next.js, React, SQL Server, Tailwind CSS',
        description: 'Plataforma completa de comercio electrónico con arquitectura multi-tenant con aislamiento de datos, catálogo interactivo de productos, facturación electrónica integrada (DIAN) y carga masiva de inventarios vía CSV.'
      },
      {
        title: 'Identity Digital Pass: Sistema de Carnetización',
        tech_stack: 'React, Node.js, Express, PostgreSQL, Docker, VPS Ubuntu',
        description: 'Sistema institucional con arquitectura de microservicios para la emisión digital y validación en tiempo real de carnets académicos mediante códigos QR únicos y control de acceso basado en roles.'
      }
    ]
  },
  automation: {
    title: 'Desarrollador Python & Especialista en Automatización (RPA & ETL)',
    bio: 'Desarrollador Python con 2.5 años de experiencia estructurando pipelines ETL masivos e implementando bots de automatización de procesos (RPA). Especializado en la orquestación de flujos de trabajo con n8n, procesamiento de datos a gran escala con Pandas, integraciones con Microsoft Graph API y optimización de flujos de datos.',
    skills: [
      { name: 'Python', category: 'Lenguajes' },
      { name: 'SQL', category: 'Lenguajes' },
      { name: 'JavaScript', category: 'Lenguajes' },
      { name: 'PowerShell / Bash', category: 'Lenguajes' },
      { name: 'Pandas', category: 'Data & ETL' },
      { name: 'NumPy', category: 'Data & ETL' },
      { name: 'ETL Pipelines', category: 'Data & ETL' },
      { name: 'Power BI', category: 'Data & ETL' },
      { name: 'n8n Workflow Engine', category: 'Automatización' },
      { name: 'Microsoft Graph API', category: 'Automatización' },
      { name: 'ZKTeco API', category: 'Automatización' },
      { name: 'RPA & Scripting', category: 'Automatización' },
      { name: 'Node.js (Express)', category: 'Backend' },
      { name: 'REST APIs & Webhooks', category: 'Backend' },
      { name: 'MySQL / MariaDB', category: 'Bases de Datos' },
      { name: 'SQL Server', category: 'Bases de Datos' },
      { name: 'PostgreSQL', category: 'Bases de Datos' },
      { name: 'Docker', category: 'DevOps & Tools' },
      { name: 'Git & GitHub', category: 'DevOps & Tools' },
      { name: 'Linux System Admin', category: 'DevOps & Tools' }
    ],
    experience: [
      {
        company: 'Fundación Universitaria Horizonte',
        role: 'Python Developer & Automation Specialist',
        period: 'Julio 2025 – Actualidad',
        description: `- Diseñé e implementé pipelines ETL con Python y Pandas para procesar, limpiar e ingestar más de 50,000 registros biométricos diarios con un 99.8% de integridad.
- Automaticé el aprovisionamiento y sincronización en tiempo real de identidades de Microsoft 365 con Azure AD mediante n8n, Python y Graph API, reduciendo el 70% de validaciones manuales.
- Orquesté flujos de trabajo asíncronos y sub-workflows modulares con n8n que automatizaron la generación y envío de reportes académicos por correo electrónico.`
      },
      {
        company: 'Freelance',
        role: 'Python Developer & Automation Specialist',
        period: 'Abril 2024 – Actualidad',
        description: `- Construcción de bots RPA en Python para la migración de datos desde hojas de cálculo Excel a MySQL y automatización de conciliaciones bancarias, ahorrando un 60% del tiempo operativo.
- Desarrollo de scripts para el procesamiento automático de archivos de nómina y facturas XML con análisis de estructura y generación de logs.
- Integración de servicios web y APIs REST de terceros para automatizar el flujo de información empresarial.`
      },
      {
        company: 'Gi Group',
        role: 'Automation Engineer',
        period: 'Octubre 2023 – Marzo 2024',
        description: `- Automaticé procesos de extracción y carga (ETL) con Python y MySQL para alimentar tableros de Power BI, reduciendo a la mitad el tiempo de generación de reportes ejecutivos.
- Creación de scripts en Python con manejo estructurado de logs y alertas para auditar la consistencia de datos financieros.`
      }
    ],
    projects: [
      {
        title: 'Proyecto Kairós: Automatización Control de Accesos Biométricos',
        tech_stack: 'Python, Pandas, ZKTeco API, MySQL, ETL',
        description: 'Script de automatización para la extracción, transformación y carga (ETL) de datos biométricos de torniquetes. Valida automáticamente horarios e inconsistencias, reduciendo 12 días de trabajo manual al mes.'
      },
      {
        title: 'Proyecto Hermes: Sincronización Automática Microsoft 365',
        tech_stack: 'Python, n8n, Microsoft Graph API, Azure AD, OAuth2',
        description: 'Ecosistema de automatización híbrido que sincroniza en tiempo real datos de usuarios académicos hacia Azure Active Directory, aprovisionando de manera masiva cuentas institucionales y licencias.'
      }
    ]
  },
  helpdesk: {
    title: 'Especialista en Soporte TI & Mesa de Ayuda | Soporte L1 & L2',
    bio: 'Profesional en Soporte TI y Mesa de Ayuda con 2.5 años de experiencia administrando infraestructura y sistemas informáticos. Especialista en la resolución de incidentes N1/N2, administración de usuarios y accesos en Microsoft 365 / Active Directory, mantenimiento preventivo de hardware y software, y soporte proactivo para garantizar la continuidad operativa.',
    skills: [
      { name: 'Soporte TI N1/N2', category: 'Soporte TI' },
      { name: 'ServiceNow & Jira', category: 'Soporte TI' },
      { name: 'M365 Admin Center', category: 'Soporte TI' },
      { name: 'Azure Active Directory', category: 'Soporte TI' },
      { name: 'Mantenimiento Hardware/Software', category: 'Soporte TI' },
      { name: 'Redes (TCP/IP, DNS, VPN)', category: 'Soporte TI' },
      { name: 'Atención al Usuario & SLAs', category: 'Soporte TI' },
      { name: 'PowerShell Scripting', category: 'Lenguajes' },
      { name: 'Python', category: 'Lenguajes' },
      { name: 'SQL', category: 'Lenguajes' },
      { name: 'Linux System Admin', category: 'DevOps & Tools' },
      { name: 'Docker', category: 'DevOps & Tools' },
      { name: 'Git & GitHub', category: 'DevOps & Tools' },
      { name: 'SQL Server / MySQL', category: 'Bases de Datos' },
      { name: 'Power BI', category: 'DevOps & Tools' }
    ],
    experience: [
      {
        company: 'Fundación Universitaria Horizonte',
        role: 'IT Support & Helpdesk Specialist',
        period: 'Julio 2025 – Actualidad',
        description: `- Brindé soporte técnico integral N1/N2 a usuarios del campus, solucionando fallas de hardware, sistemas operativos Windows/Linux y software de oficina.
- Administré el ciclo de vida de identidades en la mesa de ayuda: altas, bajas, licencias y accesos de más de 500 usuarios en Microsoft 365 y Active Directory.
- Resolví más de 100 incidentes mensuales registrados en ServiceNow y Jira Service Desk, cumpliendo de manera consistente con los SLAs en un 95%+.
- Realicé el diagnóstico de redes (cableado estructurado, Wi-Fi, VPN, DNS, DHCP) asegurando la conectividad de los laboratorios y dependencias universitarias.`
      },
      {
        company: 'Freelance',
        role: 'Support & IT Consultant',
        period: 'Abril 2024 – Actualidad',
        description: `- Asistencia técnica remota y presencial para el diagnóstico de fallas de hardware/software, optimización de sistemas operativos y eliminación de malware.
- Configuración, cableado y mantenimiento preventivo de redes locales (Wi-Fi, routers, switches) y dispositivos de almacenamiento (NAS/Servidores locales).
- Documentación técnica de incidentes frecuentes y guías de autoayuda para usuarios finales.`
      },
      {
        company: 'Gi Group',
        role: 'IT Support / Operations',
        period: 'Octubre 2023 – Marzo 2024',
        description: `- Soporte operativo y diagnóstico técnico inicial de errores de sincronización y conectividad de bases de datos.
- Mantenimiento y auditoría periódica de logs de sistemas y copias de seguridad de datos de red.`
      }
    ],
    projects: [
      {
        title: 'Mesa de Ayuda TI & Gestión de Activos Informáticos',
        tech_stack: 'ServiceNow, Jira Service Desk, Active Directory, Redes, Windows/Linux',
        description: 'Implementación y optimización de flujos de trabajo de soporte técnico. Centralizó el inventariado de equipos informáticos de la universidad y mejoró el tiempo de respuesta a incidentes bajo métricas ITIL.'
      }
    ]
  }
};

const commonEducation = [
  {
    institution: 'Corporación Unificada Nacional (CUN)',
    degree: 'Ingeniería de Sistemas | En curso',
    period: '(2023 – 2027)'
  },
  {
    institution: 'Servicio Nacional de Aprendizaje (SENA)',
    degree: 'Análisis y Desarrollo de Software | En curso',
    period: '(2024 – 2026)'
  }
];

const baselineProfile = {
  full_name: 'Jeison Molina',
  location: 'Bogotá, Colombia',
  email: 'andreyyeisonmg@gmail.com',
  whatsapp: '+57 350 549 8014',
  portfolio_url: 'jeison-molina-portafolio.vercel.app',
  linkedin: 'linkedin.com/in/jeisonmolina',
  github: 'github.com/jeisonMolina21'
};

const publicDir = path.join(__dirname, '../../frontend/public');

async function main() {
  console.log('Generating targeted static CV PDFs with layout page break control...');
  
  const roles = ['fullstack', 'automation', 'helpdesk'];
  
  for (const role of roles) {
    const roleData = staticRoleCvData[role];
    const cvData = {
      lang: 'es',
      profile: {
        ...baselineProfile,
        title: roleData.title,
        bio: roleData.bio
      },
      experience: roleData.experience,
      skills: roleData.skills,
      projects: roleData.projects,
      education: commonEducation
    };

    try {
      const buffer = await buildPdfBuffer(cvData);
      const filename = `cv-${role}.pdf`;
      fs.writeFileSync(path.join(publicDir, filename), buffer);
      console.log(`✅ Generated: ${filename}`);
      
      if (role === 'fullstack') {
        fs.writeFileSync(path.join(publicDir, 'cv.pdf'), buffer);
        console.log(`✅ Generated: cv.pdf`);
      }
    } catch (err) {
      console.error(`❌ Failed to generate CV for role ${role}:`, err.message);
    }
  }
  
  console.log('Done generating static PDFs!');
}

main();
