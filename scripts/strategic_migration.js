require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL not found in .env');
    return;
  }

  // Remove ssl-mode from string for mysql2 if it causes issues, or just use separate config
  const pool = mysql.createPool(connectionString);

  try {
    console.log('Starting strategic database update...');

    // 0. Ensure users table exists and add admin
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const adminUsername = 'jm6120346@gmail.com';
    const adminPassword = 'Horizonte.2026';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    try {
      await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [adminUsername, hashedPassword]);
      console.log('Admin user created successfully.');
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        await pool.query('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, adminUsername]);
        console.log('Admin user password updated.');
      } else {
        throw e;
      }
    }

    // 1. Add columns to projects (one by one to handle "already exists" errors)
    const projectColumns = [
      'ADD COLUMN challenge TEXT',
      'ADD COLUMN action TEXT',
      'ADD COLUMN result TEXT',
      'ADD COLUMN impact VARCHAR(255)',
      'ADD COLUMN category VARCHAR(100)'
    ];

    for (const col of projectColumns) {
      try {
        await pool.query(`ALTER TABLE projects ${col}`);
      } catch (e) {
        if (!e.message.includes('Duplicate column name')) throw e;
      }
    }

    // 2. Add columns to profile_settings
    const profileColumns = [
      'ADD COLUMN headline_metric VARCHAR(255)',
      'ADD COLUMN metrics_json TEXT'
    ];

    for (const col of profileColumns) {
      try {
        await pool.query(`ALTER TABLE profile_settings ${col}`);
      } catch (e) {
        if (!e.message.includes('Duplicate column name')) throw e;
      }
    }

    const profile = {
        full_name: "Jeison Molina",
        title_es: "Full Stack Developer | Python, Node.js & React",
        title_en: "Full Stack Developer | Python, Node.js & React",
        bio_es: "Full Stack Developer con 2.5 años de experiencia liderando el ciclo completo de desarrollo: desde el diseño de bases de datos relacionales y APIs REST robustas, hasta interfaces de usuario reactivas. Especialista en automatización de procesos críticos y despliegues con Docker.",
        bio_en: "Full Stack Developer with 2.5 years of experience leading the full development lifecycle: from relational database design and robust REST APIs to reactive user interfaces. Specialist in critical process automation and Docker deployments.",
        email: "andreyyeisonmg@gmail.com",
        linkedin: "linkedin.com/in/jeisonmolina",
        github: "github.com/jeisonMolina21",
        metrics_json: JSON.stringify([
            "Diseñé e implementé desde cero la arquitectura de BD, Backend y Frontend para sistemas de gestión de identidades.",
            "Desarrollé APIs REST con Django y Node.js para Microsoft 365 gestionando +500 usuarios/semestre.",
            "Construí pipeline ETL con Pandas y MySQL procesando +50,000 registros diarios con 99.8% de integridad.",
            "Desarrollé interfaces modernas en React/Next.js integradas con APIs de Microsoft y sistemas de nómina."
        ])
    };

    // 3. Update Profile with strategic info
    await pool.query(`
      UPDATE profile_settings SET 
        full_name = ?,
        title_es = ?,
        title_en = ?,
        bio_es = ?,
        bio_en = ?,
        email = ?,
        linkedin = ?,
        github = ?,
        metrics_json = ?
      WHERE id = 1;
    `, [
        profile.full_name,
        profile.title_es,
        profile.title_en,
        profile.bio_es,
        profile.bio_en,
        profile.email,
        profile.linkedin,
        profile.github,
        profile.metrics_json
    ]);

    // 4. Clean old projects
    await pool.query('DELETE FROM projects');
    const projects = [
      {
        title: "Marketify: SaaS E-commerce Multi-Tenant",
        category: "Full Stack / SaaS",
        description: "Plataforma de comercio electrónico con facturación legal DIAN, carga masiva CSV y arquitectura multi-tenant.",
        challenge: "PyMEs necesitan facturación legal y tienda rápida.",
        action: "Diseñé la arquitectura integral con Node.js, Astro, React y SQL Server.",
        result: "MVP funcional con carga masiva de productos y despliegue serverless.",
        tech_stack: "Node.js, Astro, React, SQL Server",
        image_url: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80",
        github_url: "https://github.com/jeisonMolina21"
      },
      {
        title: "Identity Digital Pass: Sistema de Carnetización",
        category: "Full Stack / Enterprise",
        description: "Sistema integral de carnetización digital institucional con arquitectura de microservicios y despliegue en VPS.",
        challenge: "Gestionar +1000 carnets físicos era costoso e ineficiente.",
        action: "Desarrollé el sistema con React y Node.js bajo arquitectura MVC y Microservicios.",
        result: "Despliegue exitoso en VPS Ubuntu Server con SQL Server, eliminando carnets físicos.",
        tech_stack: "React, Node.js, Microservicios, SQL Server, Ubuntu VPS",
        image_url: "https://images.unsplash.com/photo-1551288049-bbda48ad4882?auto=format&fit=crop&q=80",
        github_url: "https://github.com/jeisonMolina21"
      },
      {
        title: "Pipeline ETL Biométrico con Pandas",
        category: "Data Engineering / ETL",
        description: "Procesamiento de +50,000 registros diarios con 99.8% de integridad para nómina automatizada.",
        challenge: "Procesar 50k registros biométricos tomaba 1.5 días/mes.",
        action: "Construí pipeline ETL con Pandas para automatizar limpieza e inserción.",
        result: "Proceso en 30 min. Integridad de datos para nómina.",
        tech_stack: "Python, Pandas, MySQL, ETL",
        image_url: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80",
        github_url: "https://github.com/jeisonMolina21"
      }
    ];

    for (const p of projects) {
      await pool.query(
        'INSERT INTO projects (title, category, description, challenge, action, result, tech_stack, image_url, github_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [p.title, p.category, p.description, p.challenge, p.action, p.result, p.tech_stack, p.image_url, p.github_url]
      );
    }

    // 5. Update Skills Categories
    const skillMappings = [
      { category: 'Backend & Data', skills: ['Python', 'Django', 'Pandas', 'MySQL', 'PostgreSQL', 'SQL', 'REST APIs', 'Node.js'] },
      { category: 'Frontend', skills: ['JavaScript', 'React', 'Astro', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
      { category: 'DevOps & Cloud', skills: ['Git', 'Docker', 'Linux', 'Microsoft 365', 'Power BI', 'Vercel'] }
    ];

    for (const mapping of skillMappings) {
      await pool.query(
        'UPDATE skills SET category = ? WHERE name IN (?)',
        [mapping.category, mapping.skills]
      );
    }

    console.log('Database updated successfully with strategic content!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrate();
