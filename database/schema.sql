CREATE DATABASE IF NOT EXISTS my_proyectos_ast;
USE my_proyectos_ast;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    city VARCHAR(100),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
);

CREATE TABLE IF NOT EXISTS education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    period VARCHAR(100),
    description TEXT,
    lang VARCHAR(10) DEFAULT 'es',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profile_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    title_es TEXT,
    title_en TEXT,
    bio_es TEXT,
    bio_en TEXT,
    location VARCHAR(255),
    whatsapp VARCHAR(50),
    email VARCHAR(255),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    image_url VARCHAR(255),
    headline_metric VARCHAR(255),
    metrics_json TEXT,
    cv_backend_url VARCHAR(255),
    cv_automation_url VARCHAR(255),
    cv_helpdesk_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recognitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    entity VARCHAR(255),
    date VARCHAR(100),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial profile with 3 integrated roles
INSERT IGNORE INTO profile_settings (
    id, full_name, title_es, title_en, bio_es, bio_en, location, whatsapp, email, linkedin, github, cv_backend_url, cv_automation_url, cv_helpdesk_url
) VALUES (
    1, 
    'Jeison Molina', 
    'Fullstack Developer | Especialista en Automatización (RPA & Python) | Soporte TI & Helpdesk', 
    'Fullstack Developer | Process Automation Specialist | IT Support & Helpdesk Specialist', 
    'Ingeniero de Sistemas y Desarrollador con un perfil técnico polivalente enfocado en 3 áreas clave:\n\n1. 💻 DESARROLLO FULLSTACK & BACKEND: Creación de aplicaciones web modernas, REST APIs escalables y gestión de bases de datos relacionales (React, Node.js, Express, MySQL).\n2. ⚙️ AUTOMATIZACIÓN DE PROCESOS (RPA): Creación de bots, pipelines ETL e integraciones masivas (Python, Pandas, n8n, Microsoft Graph API) logrando ahorrar hasta 12 días de trabajo manual al mes.\n3. 🛠️ SOPORTE TI & MESA DE AYUDA: Administración de infraestructura, cuentas Microsoft 365 / Active Directory, diagnóstico de hardware/redes y resolución de incidencias N1/N2.',
    'Systems Engineer and Software Specialist with a versatile multi-domain background structured into 3 core roles:\n\n1. 💻 FULLSTACK & BACKEND DEVELOPMENT: Building scalable web applications and robust REST APIs using Node.js, Express, React, TypeScript, and MySQL.\n2. ⚙️ PROCESS AUTOMATION & RPA: Automating operational workflows using Python, Pandas, n8n, and Microsoft Graph API, saving up to 12 days of manual labor per month.\n3. 🛠️ IT SUPPORT & HELPDESK: Managing IT infrastructure, Microsoft 365 / Active Directory, L1/L2 incident resolution via ServiceNow/Jira, and hardware/network troubleshooting.',
    'Bogotá, Colombia', 
    '+573505498014',
    'andreyyeisonmg@gmail.com',
    'https://linkedin.com/in/jeisonmolina',
    'https://github.com/jeisonmolina',
    '/cv-fullstack.pdf', 
    '/cv-automation.pdf', 
    '/cv-helpdesk.pdf'
);

