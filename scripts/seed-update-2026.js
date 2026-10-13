const mysql = require('mysql2/promise');
const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function seed() {
  console.log('--- Updating Professional CV Data with Multi-Role Profiles (v2026) ---');
  
  const isPostgres = process.env.DATABASE_URL && (
    process.env.DATABASE_URL.startsWith('postgres://') || 
    process.env.DATABASE_URL.startsWith('postgresql://')
  );

  let pgClient;
  let connection;
  let connectionConfig;

  if (isPostgres) {
    console.log('Using PostgreSQL connection...');
    pgClient = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('ssl=true') ? { rejectUnauthorized: false } : undefined
    });
    try {
      await pgClient.connect();
      console.log('✅ Connected successfully to PostgreSQL!');
    } catch (err) {
      console.error('❌ PostgreSQL connection failed:', err.message);
      return;
    }
  } else {
    console.log('Using MySQL connection...');
    if (process.env.DATABASE_URL) {
      try {
        const parsed = new URL(process.env.DATABASE_URL);
        const host = parsed.hostname;
        const useSsl = process.env.DATABASE_URL.includes('ssl=true') || 
          (host !== 'localhost' && host !== '127.0.0.1' && host !== 'mariadb' && host !== 'mariadb_prod' && !host.startsWith('172.'));
        connectionConfig = {
          host,
          port: parsed.port ? parseInt(parsed.port) : 3306,
          user: decodeURIComponent(parsed.username),
          password: decodeURIComponent(parsed.password),
          database: parsed.pathname.replace(/^\//, ''),
          ssl: useSsl ? { rejectUnauthorized: false } : undefined
        };
      } catch (urlErr) {
        console.error('Failed to parse DATABASE_URL as MySQL:', urlErr.message);
      }
    }

    if (!connectionConfig) {
      connectionConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
      };
    }

    try {
      connection = await mysql.createConnection(connectionConfig);
      console.log('✅ Connected successfully to MySQL!');
    } catch (err) {
      console.error('❌ MySQL connection failed:', err.message);
      return;
    }
  }

  // Wrapper for database-agnostic queries
  async function runQuery(sql, params = []) {
    if (isPostgres) {
      let cleanSql = sql.replace(/`/g, '');
      let count = 1;
      let convertedSql = cleanSql.replace(/\?/g, () => `$${count++}`);
      
      if (convertedSql.toUpperCase().includes('INSERT IGNORE INTO')) {
        convertedSql = convertedSql.replace(/INSERT IGNORE INTO/gi, 'INSERT INTO');
        if (!convertedSql.toUpperCase().includes('ON CONFLICT')) {
          if (convertedSql.toLowerCase().includes('into skills')) {
            convertedSql += ' ON CONFLICT (name) DO NOTHING';
          } else {
            convertedSql += ' ON CONFLICT DO NOTHING';
          }
        }
      }

      const res = await pgClient.query(convertedSql, params);
      return [res.rows, null];
    } else {
      return await connection.query(sql, params);
    }
  }

  try {
    // 1. Clear existing data
    console.log('Clearing old data...');
    await runQuery('DELETE FROM skills');
    await runQuery('DELETE FROM experience');
    await runQuery('DELETE FROM projects');
    await runQuery('DELETE FROM education');
    await runQuery('DELETE FROM profile_settings');

    // 2. Seeding Profile Settings (3 distinct roles)
    console.log('Seeding 3 Profile Roles...');
    
    // Bio ES
    const bioEsFullstack = 'Desarrollador Full Stack con 2.5 años de experiencia diseñando arquitecturas de software, APIs REST estructuradas y aplicaciones web interactivas. Especializado en Python (Django REST Framework), Node.js, React y bases de datos relacionales, complementado con automatización de datos (ETL) y contenedores Docker.';
    const bioEsAutomation = 'Ingeniero de Automatización y Desarrollador RPA enfocado en la optimización y digitalización de procesos operativos. Especialista en la construcción de scripts de automatización con Python, flujos ETL con Pandas para procesamiento de grandes volúmenes de datos e integraciones con Microsoft Graph API en la nube.';
    const bioEsHelpdesk = 'Especialista en Soporte de Tecnología y Administración de Sistemas con experiencia en la gestión de infraestructuras IT corporativas. Experto en administración de Office 365, identidades de usuario en Azure Active Directory, soporte técnico niveles 1, 2 y 3, mantenimiento y aprovisionamiento automatizado.';
    
    // Bio EN
    const bioEnFullstack = 'Full Stack Developer with 2.5 years of experience designing software architectures, structured REST APIs, and interactive web applications. Specialized in Python (Django REST Framework), Node.js, React, and relational databases, complemented by data automation (ETL) and Docker containers.';
    const bioEnAutomation = 'Automation Engineer & RPA Developer focused on optimizing and digitizing operational processes. Specialist in building automation scripts with Python, ETL flows with Pandas for high-volume data processing, and cloud integrations with Microsoft Graph API.';
    const bioEnHelpdesk = 'IT Support Specialist & Systems Administrator with experience managing corporate IT infrastructures. Expert in Office 365 administration, Azure Active Directory identity management, helpdesk support levels 1, 2, and 3, maintenance, and automated provisioning.';

    const profilesData = [
      [
        1,
        'Jeison Molina',
        'Full Stack Developer | APIs & Software Architecture',
        'Full Stack Developer | APIs & Software Architecture',
        bioEsFullstack,
        bioEnFullstack,
        'Bogotá, Colombia',
        '+573505498014',
        'andreyyeisonmg@gmail.com',
        'https://linkedin.com/in/jeisonmolina',
        'https://github.com/jeisonMolina21'
      ],
      [
        2,
        'Jeison Molina',
        'Automation Engineer | Python & RPA Developer',
        'Automation Engineer | Python & RPA Developer',
        bioEsAutomation,
        bioEnAutomation,
        'Bogotá, Colombia',
        '+573505498014',
        'andreyyeisonmg@gmail.com',
        'https://linkedin.com/in/jeisonmolina',
        'https://github.com/jeisonMolina21'
      ],
      [
        3,
        'Jeison Molina',
        'IT Support Specialist | Helpdesk & SysAdmin',
        'IT Support Specialist | Helpdesk & SysAdmin',
        bioEsHelpdesk,
        bioEnHelpdesk,
        'Bogotá, Colombia',
        '+573505498014',
        'andreyyeisonmg@gmail.com',
        'https://linkedin.com/in/jeisonmolina',
        'https://github.com/jeisonMolina21'
      ]
    ];

    for (const prof of profilesData) {
      await runQuery(
        'INSERT INTO profile_settings (id, full_name, title_es, title_en, bio_es, bio_en, location, whatsapp, email, linkedin, github) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        prof
      );
    }
    console.log('✅ Profiles seeded successfully.');

    // 3. Seeding Skills
    console.log('Seeding Skills...');
    const skills = [
      // Languages
      ['Python', 'Programming'], ['SQL', 'Programming'], ['JavaScript (ES6+)', 'Programming'], ['TypeScript', 'Programming'], ['PowerShell', 'Programming'],
      // Backend
      ['Django', 'Backend'], ['Django Rest Framework (DRF)', 'Backend'], ['REST APIs', 'Backend'], ['OAuth2', 'Backend'], ['JWT', 'Backend'], ['Microsoft Graph API', 'Backend'], ['Node.js', 'Backend'],
      // Databases
      ['MySQL', 'Databases'], ['SQL Server', 'Databases'], ['PostgreSQL', 'Databases'],
      // Data & Automation
      ['Pandas', 'Data'], ['NumPy', 'Data'], ['ETL Processes', 'Data'], ['Automation', 'Data'],
      // DevOps
      ['Docker', 'DevOps'], ['Linux', 'DevOps'], ['Git', 'DevOps'], ['GitHub Actions', 'DevOps'], ['Vercel', 'DevOps'], ['Azure AD', 'DevOps'],
      // Frontend
      ['React', 'Frontend'], ['Next.js 14', 'Frontend'], ['Astro', 'Frontend'], ['Tailwind CSS', 'Frontend'],
      // Other
      ['Power BI', 'Other'], ['Technical Documentation', 'Other']
    ];
    for (const skill of skills) {
      await runQuery('INSERT INTO skills (name, category) VALUES (?, ?)', skill);
    }

    // 4. Seeding Experience (5 total rows, 3 Horizonte variations + Freelance + Gi Group)
    console.log('Seeding Experience...');
    
    // Custom LinkedIn redirection note
    const linkedInNote = ' Para ver mis demás experiencias laborales anteriores (Freelance, Gi Group), te invito a revisar mi perfil de LinkedIn: linkedin.com/in/jeisonmolina';

    const experiences = [
      // 1. Horizonte - Full Stack
      [
        'Fundación Universitaria Horizonte', 
        'Full Stack Developer (Auxiliar de Tecnología)', 
        'Julio 2025 – Actualidad', 
        'Diseñé e implementé la arquitectura integral de sistemas utilizando MySQL, Python (Django REST Framework) y React. Desarrollé APIs REST para la integración con Microsoft 365 y autenticación OAuth2. Automaticé el procesamiento de más de 50,000 registros biométricos diarios con Pandas.' + linkedInNote, 
        'Python, Django, React, REST APIs, MySQL, OAuth2, Azure AD, Automation',
        'es'
      ],
      // 2. Freelance (For Website Display)
      [
        'Freelance', 
        'Python Developer & Automation Specialist', 
        'Abril 2024 – Actualidad', 
        'Desarrollo SaaS E-commerce Multi-Tenant con Next.js 14, React y SQL Server, incluyendo facturación electrónica DIAN y arquitectura serverless. Construí bots RPA con Python para migración ETL Excel -> MySQL y conciliación bancaria, reduciendo 60% tiempo operativo con Pandas. Optimicé 8 consultas SQL críticas en SQL Server mediante índices, logrando 60% más velocidad en extracción de datos. Diseño APIs REST con Node.js y TypeScript.', 
        'Python, Next.js, React, SQL Server, Node.js, TypeScript, Astro, Pandas, RPA, ETL, SaaS, Serverless',
        'es'
      ],
      // 3. Gi Group (For Website Display)
      [
        'Gi Group', 
        'Automation Engineer', 
        'Octubre 2023 – Marzo 2024', 
        'Automaticé procesos ETL con Python y MySQL para Power BI, reduciendo 50% el tiempo de reportes ejecutivos mediante vistas materializadas. Desarrollé scripts de automatización con Python para conciliación de datos financieros con manejo de logs.', 
        'Python, MySQL, Power BI, ETL, Automation, Financial Data, Logging',
        'es'
      ],
      // 4. Horizonte - Automation
      [
        'Fundación Universitaria Horizonte', 
        'Especialista en Automatización de Procesos (Python / RPA)', 
        'Julio 2025 – Actualidad', 
        'Diseñé y automaticé pipelines ETL en Python y Pandas para la consolidación de reportes académicos, procesando más de 50,000 registros biométricos diarios. Automaticé la administración y ciclo de vida de usuarios en Azure AD y Office 365 consumiendo Microsoft Graph API, reduciendo un 70% las tareas manuales.' + linkedInNote, 
        'Python, Pandas, NumPy, ETL, Automation, Microsoft Graph API, Azure AD, MySQL',
        'es'
      ],
      // 5. Horizonte - Helpdesk
      [
        'Fundación Universitaria Horizonte', 
        'Auxiliar de Tecnología y Soporte TI', 
        'Julio 2025 – Actualidad', 
        'Administré la plataforma institucional de Office 365 y Azure Active Directory para más de 500 usuarios activos. Brindé soporte técnico integral a hardware, software, redes y sistemas corporativos. Automaticé tareas de aprovisionamiento de cuentas e integración de sistemas.' + linkedInNote, 
        'Soporte Técnico, Active Directory, Azure AD, Microsoft 365, Redes, PowerShell, SQL',
        'es'
      ]
    ];
    for (const exp of experiences) {
      await runQuery('INSERT INTO experience (company, role, period, description, skills, lang) VALUES (?, ?, ?, ?, ?, ?)', exp);
    }
    console.log('✅ Experiences seeded successfully.');

    // 5. Seeding Projects
    console.log('Seeding Projects...');
    const projects = [
      [
        'Marketify: SaaS E-commerce Multi-Tenant', 
        'Plataforma con facturación DIAN, arquitectura multi-tenant y carga masiva CSV.', 
        'https://plus.unsplash.com/premium_photo-1661877737564-3dfd7282efcb?q=80&w=2000&auto=format&fit=crop', 
        null, 
        'https://github.com/jeisonMolina21', 
        null, 
        'Node.js, Astro, React, SQL Server',
        'es'
      ],
      [
        'Identity Digital Pass: Sistema de Carnetización', 
        'Sistema institucional con arquitectura de microservicios y despliegue en VPS Ubuntu Server.', 
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2060&auto=format&fit=crop', 
        null, 
        'https://github.com/jeisonMolina21', 
        null, 
        'React, Node.js, Microservicios, SQL Server, VPS Ubuntu',
        'es'
      ]
    ];
    for (const proj of projects) {
      await runQuery('INSERT INTO projects (title, description, image_url, video_url, github_url, demo_url, tech_stack, lang) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', proj);
    }

    // 6. Seeding Education
    console.log('Seeding Education...');
    const education = [
      ['Corporación Unificada Nacional (CUN)', 'Ingeniería de Sistemas | En curso', '2023 – 2027', 'Formación avanzada en arquitectura de software, bases de datos y desarrollo de sistemas.', 'es'],
      ['Servicio Nacional de Aprendizaje (SENA)', 'Análisis y Desarrollo de Software | En curso', '2024 – 2026', 'Tecnólogo en Análisis y Desarrollo de Software con enfoque práctico en metodologías ágiles y ciclo de vida de desarrollo.', 'es']
    ];
    for (const edu of education) {
      await runQuery('INSERT INTO education (institution, degree, period, description, lang) VALUES (?, ?, ?, ?, ?)', edu);
    }

    console.log('✅ Portafolio data updated successfully for 2026!');
  } catch (error) {
    console.error('❌ Data update failed:', error.message);
    console.error(error);
  } finally {
    if (isPostgres) {
      await pgClient.end();
    } else {
      await connection.end();
    }
  }
}

seed();
