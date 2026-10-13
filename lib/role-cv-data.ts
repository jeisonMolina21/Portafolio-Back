export interface CvRoleDetail {
  title: string;
  bio: string;
  skills: { name: string; category: string }[];
  experience: {
    company: string;
    role: string;
    period: string;
    description: string;
  }[];
  projects: {
    title: string;
    tech_stack: string;
    description: string;
  }[];
}

export const roleCvData: Record<string, Record<string, CvRoleDetail>> = {
  fullstack: {
    es: {
      title: 'Junior Full Stack Developer | Python (Django REST) & React | APIs & SQL',
      bio: 'Desarrollador Full Stack Junior con sólida base en ingeniería de software, arquitectura de APIs RESTful y desarrollo web moderno. Experiencia práctica construyendo microservicios y endpoints seguros con Python (Django REST Framework) y Node.js, interfaces interactivas con React y bases de datos relacionales (PostgreSQL, MySQL, SQL Server). Enfocado en código limpio, automatizaciones de datos (ETL) y contenedores Docker.',
      skills: [
        { name: 'Python', category: 'Lenguajes' },
        { name: 'JavaScript (ES6+)', category: 'Lenguajes' },
        { name: 'TypeScript', category: 'Lenguajes' },
        { name: 'SQL', category: 'Lenguajes' },
        { name: 'HTML5 / CSS3', category: 'Frontend' },
        { name: 'React', category: 'Frontend' },
        { name: 'Next.js 14', category: 'Frontend' },
        { name: 'Astro', category: 'Frontend' },
        { name: 'Tailwind CSS', category: 'Frontend' },
        { name: 'Django / DRF', category: 'Backend' },
        { name: 'Node.js (Express)', category: 'Backend' },
        { name: 'REST APIs & Webhooks', category: 'Backend' },
        { name: 'JWT & OAuth2', category: 'Backend' },
        { name: 'PostgreSQL', category: 'Bases de Datos' },
        { name: 'MySQL', category: 'Bases de Datos' },
        { name: 'SQL Server', category: 'Bases de Datos' },
        { name: 'Docker', category: 'DevOps & Tools' },
        { name: 'Git & GitHub', category: 'DevOps & Tools' },
        { name: 'Linux (Ubuntu Server)', category: 'DevOps & Tools' }
      ],
      experience: [
        {
          company: 'Fundación Universitaria Horizonte',
          role: 'Full Stack Developer (Auxiliar de Tecnología)',
          period: 'Julio 2025 – Actualidad',
          description: `- Arquitecté e implementé la plataforma institucional de carnetización digital utilizando PostgreSQL, Backend en Python (Django REST Framework) / Node.js y Frontend reactivo en React.
- Desarrollé APIs REST con autenticación segura OAuth2 y JWT, integrando Microsoft Graph API y Azure Active Directory para el autoprovisionamiento de más de 500 usuarios activos.
- Construí un pipeline automatizado de procesamiento de datos con Pandas para conciliar más de 50,000 registros biométricos diarios con cero pérdidas de paquetes.
- Optimicé procesos del backend e integré vistas de bases de datos reduciendo la latencia de consultas críticas en un 40%.`
        },
        {
          company: 'Freelance',
          role: 'Python Developer & Automation Specialist',
          period: 'Abril 2024 – Actualidad',
          description: `- Desarrollo de un SaaS E-commerce Multi-Tenant con Next.js 14, React y SQL Server, integrando pasarelas de pago y facturación electrónica DIAN.
- Diseñé y optimicé bases de datos relacionales, creando índices y refinando procedimientos almacenados que aumentaron la velocidad de extracción de datos en un 60%.
- Implementación de flujos de autenticación OAuth 2.0 y servicios backend rápidos con Node.js y TypeScript.`
        },
        {
          company: 'Gi Group',
          role: 'Automation Engineer',
          period: 'Octubre 2023 – Marzo 2024',
          description: `- Desarrollo de scripts de integración en Python y bases de datos relacionales para optimizar la carga y sincronización de datos empresariales.
- Optimización de scripts de backend con un manejo robusto de logs de errores, aumentando la estabilidad del procesamiento en un 30%.`
        }
      ],
      projects: [
        {
          title: 'Marketify: SaaS E-commerce Multi-Tenant',
          tech_stack: 'Node.js, Next.js 14, React, SQL Server, Tailwind CSS',
          description: 'Plataforma completa de comercio electrónico con arquitectura multi-tenant con aislamiento de datos, catálogo interactivo de productos, facturación electrónica integrada (DIAN) y carga masiva de inventarios vía CSV.'
        },
        {
          title: 'Identity Digital Pass: Sistema de Carnetización',
          tech_stack: 'React, Node.js, Express, PostgreSQL, Docker, VPS Ubuntu',
          description: 'Sistema institucional con arquitectura de microservicios para la emisión digital y validación en tiempo real de carnets académicos mediante códigos QR únicos y control de acceso basado en roles.'
        }
      ]
    },
    en: {
      title: 'Junior Full Stack Developer | Python (Django REST) & React | APIs & SQL',
      bio: 'Junior Full Stack Developer with a strong software engineering foundation, RESTful API architecture expertise, and modern web application development skills. Practical experience building microservices and secure endpoints with Python (Django REST Framework) and Node.js, responsive interfaces with React, and relational databases (PostgreSQL, MySQL, SQL Server). Focused on clean code, ETL pipelines, and Docker containerization.',
      skills: [
        { name: 'Python', category: 'Languages' },
        { name: 'JavaScript (ES6+)', category: 'Languages' },
        { name: 'TypeScript', category: 'Languages' },
        { name: 'SQL', category: 'Languages' },
        { name: 'HTML5 / CSS3', category: 'Frontend' },
        { name: 'React', category: 'Frontend' },
        { name: 'Next.js 14', category: 'Frontend' },
        { name: 'Astro', category: 'Frontend' },
        { name: 'Tailwind CSS', category: 'Frontend' },
        { name: 'Django / DRF', category: 'Backend' },
        { name: 'Node.js (Express)', category: 'Backend' },
        { name: 'REST APIs & Webhooks', category: 'Backend' },
        { name: 'JWT & OAuth2', category: 'Backend' },
        { name: 'PostgreSQL', category: 'Databases' },
        { name: 'MySQL', category: 'Databases' },
        { name: 'SQL Server', category: 'Databases' },
        { name: 'Docker', category: 'DevOps & Tools' },
        { name: 'Git & GitHub', category: 'DevOps & Tools' },
        { name: 'Linux (Ubuntu Server)', category: 'DevOps & Tools' }
      ],
      experience: [
        {
          company: 'Fundación Universitaria Horizonte',
          role: 'Full Stack Developer (IT Assistant)',
          period: 'July 2025 – Present',
          description: `- Architected and implemented the complete digital ID platform using PostgreSQL, Python (Django REST Framework) / Node.js backend, and a reactive React frontend.
- Developed REST APIs with secure OAuth2 and JWT authentication, integrating Microsoft Graph API and Azure Active Directory for 500+ active users.
- Built an automated data processing pipeline with Pandas to reconcile 50,000+ daily biometric records with zero packet loss.
- Optimized backend procedures and database views, reducing critical query latency by 40%.`
        },
        {
          company: 'Freelance',
          role: 'Python Developer & Automation Specialist',
          period: 'April 2024 – Present',
          description: `- Developing a Multi-Tenant E-commerce SaaS utilizing Next.js 14, React, and SQL Server, incorporating payment gateways and DIAN electronic invoicing.
- Designed and optimized relational databases, creating indexes and refining stored procedures that improved data extraction speed by 60%.
- Implemented OAuth 2.0 authentication flows and rapid backend services with Node.js and TypeScript.`
        },
        {
          company: 'Gi Group',
          role: 'Automation Engineer',
          period: 'October 2023 – March 2024',
          description: `- Developed Python integration scripts and relational database queries to optimize corporate data synchronization.
- Enhanced backend scripts with structured error logging, improving batch processing stability by 30%.`
        }
      ],
      projects: [
        {
          title: 'Marketify: SaaS E-commerce Multi-Tenant',
          tech_stack: 'Node.js, Next.js 14, React, SQL Server, Tailwind CSS',
          description: 'A comprehensive multi-tenant e-commerce platform featuring data isolation, interactive product catalog, DIAN electronic invoicing integration, and bulk inventory upload via CSV.'
        },
        {
          title: 'Identity Digital Pass: Digital ID System',
          tech_stack: 'React, Node.js, Express, PostgreSQL, Docker, Ubuntu VPS',
          description: 'Institutional system with a microservices architecture for digital issuance and real-time validation of academic IDs through unique QR codes and role-based access control.'
        }
      ]
    }
  },
  automation: {
    es: {
      title: 'Junior Automation & Data Engineer | Python, RPA & ETL Pipelines',
      bio: 'Desarrollador Junior enfocado en automatización de procesos (RPA), ingeniería de datos y desarrollo de pipelines ETL en Python. Experiencia práctica optimizando flujos de trabajo masivos con Pandas (+50,000 registros diarios), integrando APIs cloud con Microsoft Graph API y Azure Active Directory, y orquestando arquitecturas eficientes.',
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
        { name: 'RPA & Scripting', category: 'Automatización' },
        { name: 'Django / DRF', category: 'Backend' },
        { name: 'REST APIs & Webhooks', category: 'Backend' },
        { name: 'PostgreSQL', category: 'Bases de Datos' },
        { name: 'MySQL', category: 'Bases de Datos' },
        { name: 'SQL Server', category: 'Bases de Datos' },
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
- Automaticé el aprovisionamiento y sincronización en tiempo real de identidades de Microsoft 365 con Azure AD mediante Python y Graph API, reduciendo el 70% de validaciones manuales.
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
    en: {
      title: 'Junior Automation & Data Engineer | Python, RPA & ETL Pipelines',
      bio: 'Junior Developer focused on robotic process automation (RPA), data engineering, and ETL pipeline development in Python. Practical experience optimizing high-volume data workflows with Pandas (50k+ daily records), integrating cloud APIs with Microsoft Graph API and Azure Active Directory, and building resilient automated pipelines.',
      skills: [
        { name: 'Python', category: 'Languages' },
        { name: 'SQL', category: 'Languages' },
        { name: 'JavaScript', category: 'Languages' },
        { name: 'PowerShell / Bash', category: 'Languages' },
        { name: 'Pandas', category: 'Data & ETL' },
        { name: 'NumPy', category: 'Data & ETL' },
        { name: 'ETL Pipelines', category: 'Data & ETL' },
        { name: 'Power BI', category: 'Data & ETL' },
        { name: 'n8n Workflow Engine', category: 'Automation' },
        { name: 'Microsoft Graph API', category: 'Automation' },
        { name: 'RPA & Scripting', category: 'Automation' },
        { name: 'Django / DRF', category: 'Backend' },
        { name: 'REST APIs & Webhooks', category: 'Backend' },
        { name: 'PostgreSQL', category: 'Databases' },
        { name: 'MySQL', category: 'Databases' },
        { name: 'SQL Server', category: 'Databases' },
        { name: 'Docker', category: 'DevOps & Tools' },
        { name: 'Git & GitHub', category: 'DevOps & Tools' },
        { name: 'Linux System Admin', category: 'DevOps & Tools' }
      ],
      experience: [
        {
          company: 'Fundación Universitaria Horizonte',
          role: 'Python Developer & Automation Specialist',
          period: 'July 2025 – Present',
          description: `- Designed and implemented ETL pipelines using Python and Pandas to process, clean, and ingest 50k+ daily biometric records with 99.8% integrity.
- Automated real-time provisioning and synchronization of Microsoft 365 identities with Azure AD using Python and Graph API, reducing manual validation work by 70%.
- Orchestrated asynchronous workflows in n8n that automated academic report generation and scheduled email distributions.`
        },
        {
          company: 'Freelance',
          role: 'Python Developer & Automation Specialist',
          period: 'April 2024 – Present',
          description: `- Built Python RPA bots for data migration from Excel spreadsheets to MySQL and automated bank reconciliations, saving 60% of operational time.
- Developed scripts for automated processing of payroll files and XML invoices with structural analysis and error log generation.
- Integrated third-party web services and REST APIs to automate enterprise data flow.`
        },
        {
          company: 'Gi Group',
          role: 'Automation Engineer',
          period: 'October 2023 – March 2024',
          description: `- Automated ETL extraction and loading processes using Python and MySQL for Power BI dashboards, cutting executive report generation time in half.
- Developed Python scripts with structured logging and alerts to audit the consistency of financial data.`
        }
      ],
      projects: [
        {
          title: 'Kairós Project: Biometric Access Automation',
          tech_stack: 'Python, Pandas, ZKTeco API, MySQL, ETL',
          description: 'Automation engine for extraction, transformation, and loading (ETL) of biometric data. Automatically validates schedules and anomalies, saving 12 days of manual administrative work per month.'
        },
        {
          title: 'Hermes Project: Automated Microsoft 365 Sync',
          tech_stack: 'Python, n8n, Microsoft Graph API, Azure AD, OAuth2',
          description: 'Hybrid automation ecosystem that synchronizes academic user data with Azure Active Directory in real time, executing bulk account provisioning and license management.'
        }
      ]
    }
  },
  helpdesk: {
    es: {
      title: 'Junior IT Support Specialist & SysAdmin | Cloud Identity (Azure AD & M365)',
      bio: 'Especialista Junior en soporte TI y administración de sistemas con sólida experiencia en gestión de infraestructuras corporativas, soporte técnico integral (L1/L2) y administración centralizada de identidades en Microsoft 365 y Azure Active Directory para más de 500 usuarios. Experiencia en scripting con PowerShell, redes y mantenimiento preventivo.',
      skills: [
        { name: 'Soporte TI L1/L2', category: 'Soporte TI' },
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
          description: `- Brindé soporte técnico integral L1/L2 a usuarios del campus, solucionando fallas de hardware, sistemas operativos Windows/Linux y software corporativo.
- Administré el ciclo de vida de identidades: altas, bajas, licencias y accesos de más de 500 usuarios en Microsoft 365 y Azure Active Directory.
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
    },
    en: {
      title: 'Junior IT Support Specialist & SysAdmin | Cloud Identity (Azure AD & M365)',
      bio: 'Junior IT Support Specialist & Systems Administrator with solid experience managing corporate IT infrastructures, comprehensive Tier 1/2 technical support, and centralized identity administration in Microsoft 365 and Azure Active Directory for 500+ users. Experienced in PowerShell scripting, networking, and preventive maintenance.',
      skills: [
        { name: 'IT Support L1/L2', category: 'IT Support' },
        { name: 'ServiceNow & Jira', category: 'IT Support' },
        { name: 'M365 Admin Center', category: 'IT Support' },
        { name: 'Azure Active Directory', category: 'IT Support' },
        { name: 'Hardware/Software Maintenance', category: 'IT Support' },
        { name: 'Networking (TCP/IP, DNS, VPN)', category: 'IT Support' },
        { name: 'User Support & SLAs', category: 'IT Support' },
        { name: 'PowerShell Scripting', category: 'Languages' },
        { name: 'Python', category: 'Languages' },
        { name: 'SQL', category: 'Languages' },
        { name: 'Linux System Admin', category: 'DevOps & Tools' },
        { name: 'Docker', category: 'DevOps & Tools' },
        { name: 'Git & GitHub', category: 'DevOps & Tools' },
        { name: 'SQL Server / MySQL', category: 'Databases' },
        { name: 'Power BI', category: 'DevOps & Tools' }
      ],
      experience: [
        {
          company: 'Fundación Universitaria Horizonte',
          role: 'IT Support & Helpdesk Specialist',
          period: 'July 2025 – Present',
          description: `- Provided comprehensive L1/L2 technical support to campus users, resolving hardware failures, Windows/Linux OS issues, and office software errors.
- Managed the user identity life cycle: onboarding, offboarding, licensing, and access for 500+ users in Microsoft 365 and Azure Active Directory.
- Resolved over 100 monthly tickets logged in ServiceNow and Jira Service Desk, consistently meeting and exceeding SLA targets by 95%+.
- Diagnosed and resolved local network connectivity issues (structured cabling, Wi-Fi, VPN, DNS, DHCP) for university labs and departments.`
        },
        {
          company: 'Freelance',
          role: 'Support & IT Consultant',
          period: 'April 2024 – Present',
          description: `- Provided remote and on-site technical assistance for hardware/software troubleshooting, OS optimization, and malware removal.
- Configured, wired, and performed preventive maintenance on local networks (Wi-Fi, routers, switches) and local storage devices (NAS/Local servers).
- Created technical documentation of common incidents and self-help guides for end-users.`
        },
        {
          company: 'Gi Group',
          role: 'IT Support / Operations',
          period: 'October 2023 – March 2024',
          description: `- Provided operational support and initial technical troubleshooting of synchronization errors and database connectivity issues.
- Maintained and regularly audited system logs and network data backups.`
        }
      ],
      projects: [
        {
          title: 'IT Helpdesk & Asset Management System',
          tech_stack: 'ServiceNow, Jira Service Desk, Active Directory, Networking, Windows/Linux',
          description: 'Implementation and optimization of support desk workflows. Centralized university computer asset inventory and enhanced incident response times under ITIL best practices.'
        }
      ]
    }
  }
};
