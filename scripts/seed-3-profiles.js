const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Try loading env files from common locations
[
  path.join(__dirname, '../.env'),
  path.join(__dirname, '../../.env'),
  path.join(__dirname, '../.env.local'),
  path.join(__dirname, '../../.env.local'),
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), 'backend/.env')
].forEach(envPath => {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
});

async function seed3Profiles() {
  console.log('=== Seeding 3 Multi-Role Profiles for Jeison Molina ===');
  
  const connectionUrl = process.argv[2] || process.env.DATABASE_URL;
  const host = process.env.DB_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com';
  const port = parseInt(process.env.DB_PORT || '4000');
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME || 'defaultdb';

  let connection;
  try {
    if (connectionUrl) {
      console.log(`Connecting via DATABASE_URL...`);
      connection = await mysql.createConnection(connectionUrl);
    } else if (user && password) {
      console.log(`Connecting to ${host}:${port} (${database})...`);
      connection = await mysql.createConnection({
        host,
        port,
        user,
        password,
        database,
        ssl: { rejectUnauthorized: false }
      });
    } else {
      console.log('⚠️ Notice: No active DB connection credentials provided (DB_USER/DB_PASSWORD or DATABASE_URL).');
      console.log('   The script is ready. Pass credentials via environment or command argument:');
      console.log('   node backend/scripts/seed-3-profiles.js "mysql://user:password@host:port/database"');
      return;
    }

    console.log('✅ Connected successfully to Database!');

    // 1. Clear existing data
    console.log('Ensuring tables exist...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS experience (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        period VARCHAR(100),
        description TEXT,
        skills TEXT,
        location VARCHAR(255),
        lang VARCHAR(10) DEFAULT 'es',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        challenge TEXT,
        action TEXT,
        result TEXT,
        impact VARCHAR(255),
        image_url VARCHAR(255),
        video_url VARCHAR(255),
        github_url VARCHAR(255),
        demo_url VARCHAR(255),
        tech_stack TEXT,
        lang VARCHAR(10) DEFAULT 'es',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS education (
        id INT AUTO_INCREMENT PRIMARY KEY,
        institution VARCHAR(255) NOT NULL,
        degree VARCHAR(255) NOT NULL,
        period VARCHAR(100),
        description TEXT,
        lang VARCHAR(10) DEFAULT 'es',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure lang column exists in projects
    try {
      await connection.query("ALTER TABLE projects ADD COLUMN lang VARCHAR(10) DEFAULT 'es'");
      console.log("Added 'lang' column to 'projects' table.");
    } catch (e) {
      if (!e.message.includes('Duplicate column name') && !e.message.includes('already exists')) {
        throw e;
      }
    }

    console.log('Cleaning old database records...');
    await connection.query('DELETE FROM skills');
    await connection.query('DELETE FROM experience');
    await connection.query('DELETE FROM projects');
    await connection.query('DELETE FROM education');

    // 2. Profile Settings (Integrating Fullstack, Soporte TI & Helpdesk, Automatización)
    console.log('Updating Profile Settings (3 Roles Integrated)...');
    const profileBioEs = `Ingeniero de Sistemas y Desarrollador con un perfil versátil estructurado en 3 pilares estratégicos:

1. 💻 DESARROLLADOR FULLSTACK & BACKEND: Diseño y construcción de aplicaciones web escalables y APIs REST robustas utilizando Node.js, Express, React, TypeScript y MySQL. Experiencia en arquitectura modular y desarrollo del Sistema de Carnet Digital Institucional.

2. ⚙️ ESPECIALISTA EN AUTOMATIZACIÓN & RPA: Automatización de procesos operativos e integración de plataformas complejas mediante scripts de Python, Pandas, n8n y Microsoft Graph API. Destacado por reducir hasta 12 días de trabajo manual al mes (Proyecto Kairós) y sincronizar masivamente identidades institucionales (Proyecto Hermes).

3. 🛠️ SOPORTE TI & HELPDESK: Gestión de infraestructura tecnológica, administración de Microsoft 365 / Active Directory, atención de incidentes N1/N2 en mesas de ayuda (ServiceNow, Jira), diagnósticos de redes y soporte técnico proactivo a usuarios e infraestructura.`;

    const profileBioEn = `Systems Engineer and Software Specialist with a versatile multi-domain background structured into 3 core roles:

1. 💻 FULLSTACK & BACKEND DEVELOPER: Building scalable web applications and robust REST APIs using Node.js, Express, React, TypeScript, and MySQL. Experience in modular architecture and developing the Institutional Digital ID System.

2. ⚙️ AUTOMATION & RPA SPECIALIST: Automating operational workflows and integrating enterprise software using Python, Pandas, n8n, and Microsoft Graph API. Highlighted by saving 12 days of manual work per month (Kairós Project) and synchronizing M365 identities (Hermes Project).

3. 🛠️ IT SUPPORT & HELPDESK SPECIALIST: Infrastructure support, Microsoft 365 / Active Directory administration, L1/L2 incident resolution via Service Desk (ServiceNow, Jira), network troubleshooting, and technical assistance for end-users.`;

    const profileTitleEs = 'Fullstack Developer | Especialista en Automatización (RPA & Python) | Soporte TI & Helpdesk';
    const profileTitleEn = 'Fullstack Developer | Process Automation Specialist | IT Support & Helpdesk Specialist';

    // Update profile_settings ID 1
    const [profileExists] = await connection.query('SELECT id FROM profile_settings WHERE id = 1');
    if (profileExists.length > 0) {
      await connection.query(
        `UPDATE profile_settings SET 
          full_name = ?, 
          title_es = ?, 
          title_en = ?, 
          bio_es = ?, 
          bio_en = ?, 
          location = ?, 
          whatsapp = ?, 
          email = ?, 
          linkedin = ?, 
          github = ?,
          cv_backend_url = ?,
          cv_automation_url = ?,
          cv_helpdesk_url = ?
        WHERE id = 1`,
        [
          'Jeison Molina',
          profileTitleEs,
          profileTitleEn,
          profileBioEs,
          profileBioEn,
          'Bogotá, Colombia',
          '+573505498014',
          'andreyyeisonmg@gmail.com',
          'https://linkedin.com/in/jeisonmolina',
          'https://github.com/jeisonmolina',
          '/cv-fullstack.pdf',
          '/cv-automation.pdf',
          '/cv-helpdesk.pdf'
        ]
      );
    } else {
      await connection.query(
        `INSERT INTO profile_settings 
          (id, full_name, title_es, title_en, bio_es, bio_en, location, whatsapp, email, linkedin, github, cv_backend_url, cv_automation_url, cv_helpdesk_url)
        VALUES 
          (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'Jeison Molina',
          profileTitleEs,
          profileTitleEn,
          profileBioEs,
          profileBioEn,
          'Bogotá, Colombia',
          '+573505498014',
          'andreyyeisonmg@gmail.com',
          'https://linkedin.com/in/jeisonmolina',
          'https://github.com/jeisonmolina',
          '/cv-fullstack.pdf',
          '/cv-automation.pdf',
          '/cv-helpdesk.pdf'
        ]
      );
    }

    // 3. Insert Categorized Skills (Fullstack, Automatizaciones, Soporte TI, DBs & Tools)
    console.log('Seeding Skills for all 3 Profiles...');
    const skillsList = [
      // Perfil 1: Fullstack / Backend
      ['JavaScript (ES6+)', 'Fullstack'],
      ['TypeScript', 'Fullstack'],
      ['React', 'Fullstack'],
      ['Node.js (Express)', 'Fullstack'],
      ['REST APIs', 'Fullstack'],
      ['HTML5 / CSS3', 'Fullstack'],
      ['Tailwind CSS', 'Fullstack'],
      
      // Perfil 2: Automatizaciones / RPA
      ['Python', 'Automatización'],
      ['Pandas / ETL', 'Automatización'],
      ['Microsoft Graph API', 'Automatización'],
      ['Scripting & Process Automation', 'Automatización'],
      ['n8n Workflow Automation', 'Automatización'],
      ['Excel / OpenPyXL Automation', 'Automatización'],
      ['ZKTeco API Integration', 'Automatización'],

      // Perfil 3: Soporte TI & Helpdesk
      ['Soporte TI / Mesa de Ayuda (N1/N2)', 'Soporte TI'],
      ['ServiceNow & Jira Service Desk', 'Soporte TI'],
      ['Administración Microsoft 365 & Azure AD', 'Soporte TI'],
      ['Mantenimiento & Diagnostic Hardware/Software', 'Soporte TI'],
      ['Redes & Diagnóstico (TCP/IP, DNS, VPN)', 'Soporte TI'],
      ['Atención al Usuario & Gestión de SLAs', 'Soporte TI'],

      // Bases de Datos & Herramientas Comunes
      ['MySQL / MariaDB', 'Bases de Datos'],
      ['PostgreSQL', 'Bases de Datos'],
      ['Git & GitHub', 'Herramientas'],
      ['Docker', 'Herramientas'],
      ['Linux System Admin', 'Herramientas'],
      ['Power BI', 'Herramientas']
    ];

    for (const skill of skillsList) {
      await connection.query('INSERT INTO skills (name, category) VALUES (?, ?)', skill);
    }

    // 4. Insert Experience covering all 3 profiles
    console.log('Seeding Experience for all 3 Profiles...');
    const experiences = [
      // Rol 1: Fullstack & Soporte TI en Fundación Universitaria Horizonte
      [
        'Fundación Universitaria Horizonte',
        'Desarrollador Fullstack & Asistente de Tecnología / Soporte TI',
        'Julio 2025 – Marzo 2026',
        'Liderazgo técnico en el diseño e implementación del Sistema de Carnetización Digital Institucional. Desarrollo completo de la API REST con Node.js/Express, arquitectura de base de datos MySQL y la interfaz de usuario en React. Adicionalmente, brindé soporte técnico N1/N2 (ServiceNow, Jira), gestioné cuentas/licencias de usuarios en Microsoft 365 / Active Directory y realicé el mantenimiento preventivo y correctivo de la infraestructura tecnológica de la universidad.',
        'React, Node.js, Express, MySQL, REST APIs, JWT, Soporte TI, Microsoft 365, Active Directory, ServiceNow, Jira, Troubleshooting, Redes, ITIL v4',
        'es'
      ],
      // Rol 2: Especialista en Automatización en Fundación Universitaria Horizonte
      [
        'Fundación Universitaria Horizonte',
        'Especialista en Automatización de Procesos (Python / RPA)',
        'Julio 2025 – Marzo 2026',
        'Diseño, desarrollo y orquestación de soluciones de automatización corporativa de alto impacto: Proyecto Kairós (pipeline ETL en Python con Pandas y ZKTeco API para ingesta y validación de 50k+ registros biométricos diarios, ahorrando 12 días de trabajo manual al mes) y Proyecto Hermes (sincronización automática de identidades en Microsoft Azure AD mediante n8n, Python y Microsoft Graph API).',
        'Python, Pandas, n8n, Microsoft Graph API, ZKTeco API, ETL, OAuth 2.0, JSON, SQL, Automatización de Procesos, scripting',
        'es'
      ]
    ];

    for (const exp of experiences) {
      await connection.query(
        'INSERT INTO experience (company, role, period, description, skills, lang) VALUES (?, ?, ?, ?, ?, ?)',
        exp
      );
    }

    // 5. Insert Projects for each profile
    console.log('Seeding Projects for all 3 Profiles...');
    const projects = [
      // Perfil 1: Fullstack
      [
        'Sistema de Carnetización Digital Institucional',
        'Plataforma web Fullstack para la generación, validación y gestión centralizada de pases digitales de la institución. Incluye autenticación segura por roles (Administrador, Docente, Estudiante), panel interactivo CRUD y arquitectura de API REST con base de datos relacional.',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
        null,
        'https://github.com/jeisonmolina',
        null,
        'React, Node.js, Express, MySQL, Tailwind CSS, TypeScript',
        'es'
      ],
      // Perfil 2: Automatización 1
      [
        'Proyecto Kairós – Automatización Control de Accesos Biométricos',
        'Bot de automatización en Python para el procesamiento, validación e ingesta masiva de datos de torniquetes biométricos ZKTeco. Automatiza la detección de horarios e inconsistencias, eliminando 12 días de trabajo manual mensual.',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
        null,
        'https://github.com/jeisonmolina',
        null,
        'Python, Pandas, ZKTeco API, MySQL, ETL',
        'es'
      ],
      // Perfil 2: Automatización 2
      [
        'Proyecto Hermes – Sincronización Automática Microsoft 365',
        'Orquestador híbrido de automatización (Python + n8n + Microsoft Graph API) que sincroniza en tiempo real datos de usuarios entre el sistema académico Q10 y Microsoft Azure AD, automatizando el aprovisionamiento de cuentas e identidades.',
        'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800',
        null,
        'https://github.com/jeisonmolina',
        null,
        'Python, n8n, Microsoft Graph API, OAuth 2.0, JSON',
        'es'
      ],
      // Perfil 3: Soporte TI / Helpdesk
      [
        'Mesa de Ayuda TI & Gestión de Activos Informáticos',
        'Implementación y optimización de flujos de trabajo para la mesa de ayuda institucional. Protocolo de atención N1/N2, catálogo de servicios, inventariado de equipos de cómputo y monitoreo de acuerdos de nivel de servicio (SLAs).',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
        null,
        'https://github.com/jeisonmolina',
        null,
        'ServiceNow, Jira Service Desk, Active Directory, Redes, Troubleshooting N1/N2',
        'es'
      ]
    ];

    for (const proj of projects) {
      await connection.query(
        'INSERT INTO projects (title, description, image_url, video_url, github_url, demo_url, tech_stack, lang) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        proj
      );
    }

    // 6. Insert Education
    console.log('Seeding Education...');
    const education = [
      ['Corporación Unificada Nacional – CUN', 'Ingeniería de Sistemas', 'En curso (7mo Semestre)', 'Formación en arquitectura de software, redes de computadoras, gestión de bases de datos y seguridad informática.', 'es'],
      ['Servicio Nacional de Aprendizaje – SENA', 'Tecnólogo en Análisis y Desarrollo de Software', 'Graduación 2026', 'Fundamentos de ingeniería de software, ciclo de vida de desarrollo, bases de datos y metodologías ágiles.', 'es']
    ];
    for (const edu of education) {
      await connection.query(
        'INSERT INTO education (institution, degree, period, description, lang) VALUES (?, ?, ?, ?, ?)',
        edu
      );
    }

    await connection.end();
    console.log('✅ DATABASE POPULATED SUCCESSFULLY WITH ALL 3 PROFILES!');
  } catch (error) {
    console.error('❌ Error executing database script:', error);
    process.exit(1);
  }
}

seed3Profiles();
