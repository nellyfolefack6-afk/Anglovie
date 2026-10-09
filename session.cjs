const crypto = require('node:crypto');
const COOKIE = 'silfa_ai';
function entries() {
  try {
    const raw = JSON.parse(process.env.SILFA_AI_CODES_JSON || '[]');
    return Array.isArray(raw) ? raw.filter(x => x && typeof x.code === 'string' && x.code.length >= 24 && typeof x.id === 'string' && x.id.length && /^\d{4}-\d{2}-\d{2}$/.test(x.expires) && !Number.isNaN(Date.parse(x.expires + 'T23:59:59Z'))) : [];
  } catch { return []; }
}
function configured() { return !!(process.env.ANTHROPIC_API_KEY && process.env.SILFA_SESSION_SECRET?.length >= 32 && entries().length); }
function signature(data) { return crypto.createHmac('sha256', process.env.SILFA_SESSION_SECRET || '').update(data).digest('base64url'); }
function equal(a, b) { return crypto.timingSafeEqual(crypto.createHash('sha256').update(String(a)).digest(), crypto.createHash('sha256').update(String(b)).digest()); }
function token(entry) {
  const exp = Math.min(Date.now() + 7 * 86400000, Date.parse(entry.expires + 'T23:59:59Z'));
  const data = Buffer.from(JSON.stringify({ id: entry.id, exp })).toString('base64url');
  return { value: data + '.' + signature(data), age: Math.max(0, Math.floor((exp - Date.now()) / 1000)) };
}
function session(event) {
  if (!configured()) return null;
  try {
    const cookie = event.headers?.cookie || event.headers?.Cookie || '';
    const raw = cookie.split(';').map(x => x.trim()).find(x => x.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1);
    if (!raw || raw.length > 2000) return null;
    const [data, sig, extra] = raw.split('.');
    if (extra || !sig || !equal(sig, signature(data))) return null;
    const s = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (!Number.isFinite(s.exp) || s.exp <= Date.now()) return null;
    const entry = entries().find(x => x.id === s.id && Date.parse(x.expires + 'T23:59:59Z') > Date.now());
    return entry ? s : null;
  } catch { return null; }
}
function sameOrigin(event) {
  const origin = event.headers?.origin || event.headers?.Origin;
  const host = event.headers?.host || event.headers?.Host;
  if (!origin || !host) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}
function response(statusCode, body, extra = {}) {
  return { statusCode, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra }, body: JSON.stringify(body) };
}
module.exports = { COOKIE, entries, configured, equal, token, session, sameOrigin, response };
