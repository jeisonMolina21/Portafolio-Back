/**
 * @file helpers.ts
 * @description Funciones de utilidad compartidas en el backend para procesamiento de URLs de base de datos,
 * manipulación de expresiones regulares y gestión de cabeceras CORS.
 */

/**
 * Analiza de manera segura una URL de conexión de base de datos MySQL.
 * 
 * @description
 * **Qué hace:** Convierte una cadena de conexión URL de base de datos MySQL en un objeto estructurado
 * compatible con la configuración de `mysql2`.
 * 
 * **Cómo lo hace:** Utiliza el objeto nativo de Node.js `URL` para extraer las propiedades individuales del host,
 * puerto, credenciales de usuario, nombre de la base de datos y decodificar caracteres especiales de la contraseña.
 * 
 * **Qué recibe (Inputs):**
 * - `url` (string): Cadena de conexión MySQL (ej. "mysql://user:pass@host:port/database").
 * 
 * **Cómo lo envía (Outputs):**
 * - (object | null): Objeto con las propiedades de conexión de `mysql2` o `null` si falla el formateo.
 * 
 * **Qué soluciona:** Evita fallas de conexión donde el controlador de MySQL ignora la propiedad `uri`
 * en entornos serverless cuando se le pasa directamente una variable de entorno.
 * 
 * **Ejemplo de uso:**
 * ```typescript
 * const config = parseDatabaseUrl("mysql://root:p%40ss@127.0.0.1:3306/db");
 * // Devuelve: { host: "127.0.0.1", port: 3306, user: "root", password: "p@ss", database: "db", ssl: { ... } }
 * ```
 */
export const parseDatabaseUrl = (url: string) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    const useSsl = url.includes('ssl=true') || 
      (host !== 'localhost' && host !== '127.0.0.1' && host !== 'mariadb' && host !== 'mariadb_prod' && !host.startsWith('172.'));
    return {
      host,
      port: parsed.port ? parseInt(parsed.port) : 3306,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, ''),
      ssl: useSsl ? { rejectUnauthorized: false } : undefined
    };
  } catch (err) {
    console.error('Failed to parse database connection URL:', err);
    return null;
  }
};

/**
 * Escapa los caracteres de control de expresiones regulares.
 * 
 * @description
 * **Qué hace:** Prepara cadenas de texto de entrada para ser interpoladas de manera segura dentro de una expresión regular dinámica.
 * 
 * **Cómo lo hace:** Ejecuta un reemplazo global con regex escapando caracteres especiales (`/ \ - ^ $ * + ? . ( ) | [ ] { }`) anteponiéndoles una barra invertida.
 * 
 * **Qué recibe (Inputs):**
 * - `str` (string): La cadena de texto cruda a escapar (ej. "Sobre mí").
 * 
 * **Cómo lo envía (Outputs):**
 * - (string): La cadena con caracteres especiales escapados de forma segura.
 * 
 * **Qué soluciona:** Previene errores de sintaxis en tiempo de ejecución al inicializar la clase `RegExp`
 * si el texto buscado contiene símbolos de expresión regular (como paréntesis o signos de interrogación).
 * 
 * **Ejemplo de uso:**
 * ```typescript
 * const escaped = escapeRegex("Sobre mí");
 * // Devuelve: "Sobre mí"
 * ```
 */
export const escapeRegex = (str: string): string => {
  return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
};

/**
 * Genera el conjunto estándar de cabeceras CORS del backend.
 * 
 * @description
 * **Qué hace:** Genera los headers HTTP necesarios para autorizar llamadas desde clientes externos
 * controlando la política de origen cruzado (CORS).
 * 
 * **Cómo lo hace:** Compara el origen que realiza la solicitud con orígenes locales permitidos o subdominios
 * de Vercel y asigna dinámicamente las cabeceras `'Access-Control-Allow-Origin'`, `'Access-Control-Allow-Methods'`, etc.
 * 
 * **Qué recibe (Inputs):**
 * - `origin` (string, opcional): Cabecera de origen recibida de la petición del cliente.
 * 
 * **Cómo lo envía (Outputs):**
 * - (Record<string, string>): Un diccionario clave-valor con las cabeceras HTTP de CORS aplicables.
 * 
 * **Qué soluciona:** Centraliza y automatiza el control de peticiones de origen cruzado (CORS) tanto en desarrollo local
 * (Astro en puerto `4321`) como en producción desplegada en Vercel.
 * 
 * **Ejemplo de uso:**
 * ```typescript
 * const headers = getCorsHeaders("http://localhost:4321");
 * // Devuelve: { 'Access-Control-Allow-Origin': 'http://localhost:4321', ... }
 * ```
 */
export const getCorsHeaders = (origin?: string | null): Record<string, string> => {
  const FRONTEND_URL = process.env.FRONTEND_URL || 'https://jeison-molina-portafolio.vercel.app';
  const isLocal = origin && (origin.includes('localhost') || origin.includes('127.0.0.1'));
  const isVercel = origin && (origin.endsWith('.vercel.app') || origin === FRONTEND_URL);
  const allowed = (isLocal || isVercel) ? origin : FRONTEND_URL;
  
  return {
    'Access-Control-Allow-Origin': allowed || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };
};
