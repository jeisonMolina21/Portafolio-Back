/**
 * Selects the appropriate language field from an object based on the requested language.
 * Falls back to the alternative language if the requested one is empty.
 */
export const getLocalizedField = (obj: any, fieldBase: string, lang: string = 'es') => {
  const esField = `${fieldBase}_es`;
  const enField = `${fieldBase}_en`;

  if (lang === 'en') {
    return obj[enField] || obj[esField] || obj[fieldBase] || null;
  }
  return obj[esField] || obj[enField] || obj[fieldBase] || null;
};

/**
 * Maps multiple localized fields in a single object.
 */
export const localizeObject = (obj: any, fields: string[], lang: string = 'es') => {
  if (!obj) return null;
  
  const result = { ...obj };
  fields.forEach(field => {
    result[field] = getLocalizedField(obj, field, lang);
  });
  return result;
};
