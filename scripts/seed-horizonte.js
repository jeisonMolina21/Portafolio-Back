const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('Connected to database.');

  try {
    // Clear existing data (optional, but good for a fresh start with this specific set)
    // await connection.query('DELETE FROM projects');
    // await connection.query('DELETE FROM experience');

    // 1. Projects
    const projects = [
      {
        title: 'Identity Digital Pass — Carnetización Virtual',
        description: 'La universidad emitía carnets físicos con procesos manuales lentos. Diseñé la arquitectura completa MySQL + Node.js + React con QR único verificable.',
        tech_stack: 'MySQL, Node.js, React, Microservicios, VPS Ubuntu',
        image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80',
        challenge: 'La universidad emitía carnets físicos con procesos manuales lentos, propensos a falsificaciones y sin trazabilidad.',
        action: 'Diseñé la arquitectura completa: MySQL + Node.js (API REST) + React (SPA) desplegada en VPS Ubuntu con microservicios.',
        result: '100% digitalizado, 0 carnets físicos, disponibilidad 24/7.',
        lang: 'es'
      },
      {
        title: 'Sistema de Gestión de Activos Fijos & Inventario TI',
        description: 'Plataforma web con Astro + React para inventario de hardware. Reemplazó por completo los archivos Excel dispersos.',
        tech_stack: 'Astro, React, Node.js, SQL Server',
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
        challenge: 'El inventario de activos TI se gestionaba en hojas Excel dispersas. Imposible saber qué equipo tenía cada funcionario.',
        action: 'Plataforma web completa con Astro + React para inventario de CPU, monitores, teclados y periféricos.',
        result: '1 vista total, 0 Excel, generación automática de hojas de vida de activos.',
        lang: 'es'
      },
      {
        title: 'Automatización de Correos Institucionales',
        description: 'Script Python que aprovisiona 1,000 correos en 5 min vía Microsoft Graph API. Eliminó 60+ horas de trabajo manual.',
        tech_stack: 'Python, Microsoft Graph API, Azure AD, OAuth2',
        image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80',
        challenge: 'Cada semestre se pasaban más de 60 horas creando manualmente correos institucionales uno por uno.',
        action: 'Script Python con Microsoft Graph API para aprovisionamiento masivo y manejo de errores por lote.',
        result: '1,000 correos en 5 min, 60 hrs liberadas, notificación automática.',
        lang: 'es'
      },
      {
        title: 'Pipeline ETL Biométrico para Nómina',
        description: 'Procesamiento masivo de +50,000 registros diarios con 99.8% de integridad. Integración de 6 sistemas vía REST APIs.',
        tech_stack: 'Python, Pandas, MySQL, Django',
        image_url: 'https://images.unsplash.com/photo-1551288049-bbda0231f673?auto=format&fit=crop&q=80',
        challenge: 'El cálculo de nómina dependía de registros biométricos manuales con frecuentes pérdidas de datos.',
        action: 'Pipeline ETL automatizado que ingesta, normaliza y carga registros diarios en MySQL.',
        result: '50K+ registros/día, 99.8% integridad, 70% menos validaciones manuales.',
        lang: 'es'
      },
      {
        title: 'Marketify — SaaS E-commerce Multi-Tenant',
        description: 'Plataforma con facturación DIAN integrada y arquitectura serverless. 98/100 Lighthouse score.',
        tech_stack: 'Next.js 14, React, SQL Server, Node.js, TypeScript',
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
        challenge: 'Comercios necesitaban escalar ventas con facturación DIAN y aislamiento de datos por cliente.',
        action: 'Arquitectura multi-tenant con aislamiento total y facturación electrónica end-to-end.',
        result: 'Multi-tenant real, DIAN integrada, 98/100 Lighthouse.',
        lang: 'es'
      }
    ];

    for (const p of projects) {
      await connection.query(
        'INSERT INTO projects (title, description, tech_stack, image_url, challenge, action, result, lang) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [p.title, p.description, p.tech_stack, p.image_url, p.challenge, p.action, p.result, p.lang]
      );
    }

    // 2. Experience
    const experience = [
      {
        company: 'Fundación Universitaria Horizonte',
        role: 'Full Stack Developer — Auxiliar de Tecnología',
        period: 'Jul 2025 – Actualidad',
        description: 'Diseñé e implementé 4 sistemas institucionales en producción. Automatización de 1,000 correos en 5 min eliminando 60+ horas manuales. Pipeline ETL de +50,000 registros diarios.',
        skills: 'Python, MySQL, Node.js, React, Astro, Microsoft Graph API, Pandas',
        lang: 'es'
      }
    ];

    for (const e of experience) {
      await connection.query(
        'INSERT INTO experience (company, role, period, description, skills, lang) VALUES (?, ?, ?, ?, ?, ?)',
        [e.company, e.role, e.period, e.description, e.skills, e.lang]
      );
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await connection.end();
  }
}

seed();
