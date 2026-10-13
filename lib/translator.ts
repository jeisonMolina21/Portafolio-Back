/**
 * @file translator.ts
 * @description Servicio de traducción asíncrono para el portapapeles y textos del portafolio.
 * Soporta LibreTranslate y un diccionario local optimizado para términos técnicos en español.
 */

import { escapeRegex } from './helpers';

const translationCache = new Map<string, string>();

/**
 * Traduce una cadena de texto al idioma objetivo seleccionado.
 * 
 * @description
 * **Qué hace:** Traduce textos del portafolio (como títulos, descripciones, etc.) del español al idioma destino (generalmente inglés).
 * 
 * **Cómo lo hace:** 
 * 1. Verifica si el idioma objetivo es español o si la cadena está vacía (retorna el original).
 * 2. Consulta en un caché en memoria para retornar respuestas repetidas inmediatamente.
 * 3. Ejecuta primero un reemplazo local basado en un diccionario (`applyDictionary`).
 * 4. Si el término no coincide y existe una instancia de `LIBRETRANSLATE_URL` en las variables de entorno,
 *    realiza una petición POST HTTP asíncrona a la API externa. En caso contrario, retorna el texto original.
 * 
 * **Qué recibe (Inputs):**
 * - `text` (string): Cadena de texto a traducir.
 * - `targetLang` (string): Código de idioma destino (ej. "en").
 * 
 * **Cómo lo envía (Outputs):**
 * - (Promise<string>): Promesa que resuelve a la cadena traducida.
 * 
 * **Qué soluciona:** Proporciona un mecanismo híbrido (rápido local y de traducción dinámica automática externa)
 * para internacionalizar dinámicamente el portafolio sin tener que duplicar tablas de base de datos para cada idioma.
 * 
 * **Ejemplo de uso:**
 * ```typescript
 * const textEn = await translate("Desarrollador de Software", "en");
 * // Devuelve: "Software Developer"
 * ```
 */
export async function translate(text: string, targetLang: string): Promise<string> {
  if (!text || targetLang === 'es') return text;

  const cacheKey = `${targetLang}:${text}`;
  if (translationCache.has(cacheKey)) return translationCache.get(cacheKey)!;

  // Try dictionary first (fast path)
  const dictResult = applyDictionary(text);
  if (dictResult !== text) {
    translationCache.set(cacheKey, dictResult);
    return dictResult;
  }

  // Try LibreTranslate if configured
  const libreUrl = process.env.LIBRETRANSLATE_URL;
  if (libreUrl) {
    try {
      const res = await fetch(`${libreUrl}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, source: 'es', target: targetLang, format: 'text' }),
      });
      if (res.ok) {
        const data = await res.json();
        const translated = data.translatedText as string;
        translationCache.set(cacheKey, translated);
        return translated;
      }
    } catch (error) {
      console.error('LibreTranslate error:', error);
    }
  }

  // Final fallback: return original text unchanged
  return text;
}

/**
 * Traduce términos mediante un diccionario estático local usando límites de palabra unicode.
 * 
 * @description
 * **Qué hace:** Traduce palabras clave comunes de la interfaz utilizando un diccionario estático en memoria.
 * 
 * **Cómo lo hace:** Itera sobre el diccionario estático. Para cada palabra, construye una expresión regular dinámica
 * que delimita el término usando aserciones lookaround personalizadas para soportar caracteres unicode con acento,
 * y reemplaza las coincidencias en el texto de entrada.
 * 
 * **Qué recibe (Inputs):**
 * - `text` (string): El texto original a mapear.
 * 
 * **Cómo lo envía (Outputs):**
 * - (string): El texto resultante traducido.
 * 
 * **Qué soluciona:** Soluciona el bug de expresiones regulares donde `\b` ignoraba límites de palabras
 * que contienen acentos o caracteres especiales al final (como "Sobre mí").
 * 
 * **Ejemplo de uso:**
 * ```typescript
 * const dictOutput = applyDictionary("Sobre mí y mis proyectos");
 * // Devuelve: "About me y mis projects"
 * ```
 */
function applyDictionary(text: string): string {
  const dictionary: Record<string, string> = {
    'Desarrollador': 'Developer',
    'Software': 'Software',
    'Experiencia': 'Experience',
    'Proyectos': 'Projects',
    'Educación': 'Education',
    'Contacto': 'Contact',
    'Sobre mí': 'About me',
    'Habilidades': 'Skills',
    'Tecnologías': 'Technologies',
    'Responsabilidades': 'Responsibilities',
    'Logros': 'Achievements',
    'Actualmente': 'Currently',
    'Actuamente': 'Currently',
    'Presente': 'Present',
    'Enero': 'January',
    'Febrero': 'February',
    'Marzo': 'March',
    'Abril': 'April',
    'Mayo': 'May',
    'Junio': 'June',
    'Julio': 'July',
    'Agosto': 'August',
    'Septiembre': 'September',
    'Octubre': 'October',
    'Noviembre': 'November',
    'Diciembre': 'December',
  };

  let result = text;
  Object.entries(dictionary).forEach(([word, translation]) => {
    const escapedWord = escapeRegex(word);
    const regex = new RegExp(`(?<=^|[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9_])${escapedWord}(?=$|[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9_])`, 'gi');
    result = result.replace(regex, translation);
  });
  return result;
}
