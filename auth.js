const { COOKIE, entries, configured, equal, token, session, sameOrigin, response } = require('../lib/session.cjs');
exports.config = { rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ['ip', 'domain'] } };
exports.handler = async event => {
  if (event.httpMethod === 'GET') return response(200, { configured: configured(), authenticated: !!session(event) });
  if (!['POST', 'DELETE'].includes(event.httpMethod)) return response(405, { error: 'Method not allowed.' });
  if (!sameOrigin(event)) return response(403, { error: 'Origin not allowed.' });
  if (event.httpMethod === 'DELETE') return response(200, { ok: true }, { 'Set-Cookie': `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0` });
  if (!configured()) return response(503, { error: 'The AI service has not been activated by UCBH yet.' });
  if (!event.body || event.body.length > 1000) return response(400, { error: 'Invalid request.' });
  let body; try { body = JSON.parse(event.body); } catch { return response(400, { error: 'Invalid request.' }); }
  if (typeof body.code !== 'string' || body.code.length > 200) return response(400, { error: 'Invalid code.' });
  const entry = entries().find(x => equal(x.code, body.code.trim()) && Date.parse(x.expires + 'T23:59:59Z') > Date.now());
  if (!entry) return response(401, { error: 'The code is not recognized or has expired. Contact UCBH.' });
  const t = token(entry);
  return response(200, { authenticated: true }, { 'Set-Cookie': `${COOKIE}=${t.value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${t.age}` });
};
