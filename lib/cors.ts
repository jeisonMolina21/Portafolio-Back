/**
 * @file cors.ts
 * @description Módulo de utilidades para aplicar políticas de intercambio de recursos de origen cruzado (CORS)
 * en las respuestas HTTP de Next.js.
 */

import { NextResponse } from 'next/server';
import { getCorsHeaders } from './helpers';

/**
 * Retorna un diccionario clave-valor con los encabezados CORS correspondientes.
 * 
 * @description
 * **Qué hace:** Expone las cabeceras CORS formateadas para el origen que realiza la petición.
 * 
 * **Cómo lo hace:** Llama internamente a la función helper reutilizable `getCorsHeaders`.
 * 
 * **Qué recibe (Inputs):**
 * - `origin` (string, opcional): Origen desde donde el cliente envía la petición (ej. "http://localhost:4321").
 * 
 * **Cómo lo envía (Outputs):**
 * - (Record<string, string>): Objeto plano conteniendo las cabeceras HTTP de respuesta de CORS.
 * 
 * **Qué soluciona:** Evita duplicar lógica de coincidencia de subdominios y localhost en múltiples partes del backend,
 * aislando el cálculo del header a una función pura reutilizable.
 * 
 * **Ejemplo de uso:**
 * ```typescript
 * const headers = corsHeaders("http://localhost:4321");
 * // Devuelve: { "Access-Control-Allow-Origin": "http://localhost:4321", ... }
 * ```
 */
export function corsHeaders(origin?: string | null): Record<string, string> {
  return getCorsHeaders(origin);
}

/**
 * Inyecta las cabeceras CORS en una respuesta de Next.js existente.
 * 
 * @description
 * **Qué hace:** Toma un objeto `NextResponse` y le inyecta las cabeceras CORS necesarias antes de enviarlo al cliente.
 * 
 * **Cómo lo hace:** Obtiene las cabeceras utilizando `getCorsHeaders` y luego itera sobre el objeto
 * utilizando `response.headers.set(clave, valor)` para adjuntarlas a la respuesta.
 * 
 * **Qué recibe (Inputs):**
 * - `response` (NextResponse): Instancia de respuesta HTTP de Next.js.
 * - `origin` (string, opcional): Origen del cliente que realiza la petición.
 * 
 * **Cómo lo envía (Outputs):**
 * - (NextResponse): La misma respuesta HTTP mutada conteniendo las cabeceras CORS añadidas.
 * 
 * **Qué soluciona:** Simplifica la sintaxis de las respuestas en los endpoints del API de Next.js, permitiendo
 * habilitar CORS en una sola línea de código sobre cualquier respuesta JSON.
 * 
 * **Ejemplo de uso:**
 * ```typescript
 * return withCors(NextResponse.json({ ok: true }), req.headers.get('origin'));
 * ```
 */
export function withCors(response: NextResponse, origin?: string | null): NextResponse {
  const headers = getCorsHeaders(origin);
  Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}

/**
 * Crea una respuesta estándar de código 204 No Content para peticiones de preflight OPTIONS.
 * 
 * @description
 * **Qué hace:** Genera una respuesta vacía con código de estado 204 y cabeceras CORS para responder a las verificaciones previas (Preflight) de los navegadores.
 * 
 * **Cómo lo hace:** Retorna una nueva instancia de `NextResponse` vacía con estado 204 y le adjunta las cabeceras generadas por `getCorsHeaders`.
 * 
 * **Qué recibe (Inputs):**
 * - `origin` (string, opcional): Origen de la petición OPTIONS.
 * 
 * **Cómo lo envía (Outputs):**
 * - (NextResponse): Respuesta HTTP 204 vacía con las cabeceras CORS adecuadas.
 * 
 * **Qué soluciona:** Permite que los navegadores aprueben peticiones CORS de tipo POST, PUT y DELETE
 * al responder con éxito y cabeceras correctas a la petición preliminar de tipo `OPTIONS` (Preflight request).
 * 
 * **Ejemplo de uso:**
 * ```typescript
 * export async function OPTIONS(req: NextRequest) {
 *   return optionsResponse(req.headers.get('origin'));
 * }
 * ```
 */
export function optionsResponse(origin?: string | null): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}
