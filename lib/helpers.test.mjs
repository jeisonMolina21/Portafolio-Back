import test from 'node:test';
import assert from 'node:assert/strict';

// Helper parser tests using Node native test runner
import { parseDatabaseUrl, escapeRegex, getCorsHeaders } from './helpers.ts';

test('parseDatabaseUrl - analiza URLs válidas de MySQL', () => {
  const url = 'mysql://user123:secret_pass@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/my_proyectsast';
  const parsed = parseDatabaseUrl(url);
  assert.notEqual(parsed, null);
  assert.equal(parsed.host, 'gateway01.us-east-1.prod.aws.tidbcloud.com');
  assert.equal(parsed.port, 4000);
  assert.equal(parsed.user, 'user123');
  assert.equal(parsed.password, 'secret_pass');
  assert.equal(parsed.database, 'my_proyectsast');
});

test('parseDatabaseUrl - maneja cadenas vacías o inválidas sin explotar', () => {
  assert.equal(parseDatabaseUrl(''), null);
  assert.equal(parseDatabaseUrl('not_a_valid_url'), null);
});

test('escapeRegex - escapa caracteres de control de expresiones regulares', () => {
  assert.equal(escapeRegex('Sobre (mí)?'), 'Sobre \\(mí\\)\\?');
  assert.equal(escapeRegex('React.js / Node.js'), 'React\\.js \\/ Node\\.js');
});

test('getCorsHeaders - genera cabeceras de origen permitido para localhost y Vercel', () => {
  const localHeaders = getCorsHeaders('http://localhost:4321');
  assert.equal(localHeaders['Access-Control-Allow-Origin'], 'http://localhost:4321');

  const vercelHeaders = getCorsHeaders('https://my-app.vercel.app');
  assert.equal(vercelHeaders['Access-Control-Allow-Origin'], 'https://my-app.vercel.app');
});
