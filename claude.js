const { configured, session, sameOrigin, response } = require('../lib/session.cjs');
exports.config = { rateLimit: { windowLimit: 20, windowSize: 60, aggregateBy: ['ip', 'domain'] } };
exports.handler = async event => {
  if (event.httpMethod !== 'POST') return response(405, { error: 'Method not allowed.' });
  if (!sameOrigin(event)) return response(403, { error: 'Origin not allowed.' });
  if (!configured()) return response(503, { error: 'The AI service has not been activated by UCBH yet.' });
  if (!session(event)) return response(401, { error: 'Activate your access in the AI coach section.' });
  if (!event.body || event.body.length > 35000) return response(413, { error: 'Your message is too long.' });
  let b; try { b = JSON.parse(event.body); } catch { return response(400, { error: 'Invalid request.' }); }
  if (!Array.isArray(b.messages) || b.messages.length < 1 || b.messages.length > 16 || b.messages.some(m => !m || !['user', 'assistant'].includes(m.role) || typeof m.content !== 'string' || m.content.length > 6000) || b.messages[0].role !== 'user') return response(400, { error: 'Invalid conversation.' });
  if (b.messages.reduce((n, m) => n + m.content.length, 0) > 24000) return response(413, { error: 'This conversation is too long. Start a new exercise.' });
  const level = ['A1','A2','B1','B2'].includes(b.level) ? b.level : 'A2';
  const base = `You are the AngloVie AI English practice coach for UCBH's SILFA program. You are an AI, not Nelly Folefack or a human peer. Help the learner practise everyday and workplace English at approximate self-reported level ${level}. Be warm and concise. Use simple English for explanations. Switch languages only if the learner explicitly asks. Do not certify language levels or claim a course-completion log proves mastery. For role plays, keep medical, legal and financial content limited to language practice; do not invent official eligibility rules. Do not promise jobs, bookings, peer matching or placement. Never say that an external action was performed. Respond in 2–6 sentences unless a specific exercise needs more.`;
  const task = typeof b.system === 'string' ? b.system.slice(0,5500) : 'Help the learner practise English.';
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: AbortSignal.timeout(25000),
      headers: { 'Content-Type':'application/json', 'x-api-key':process.env.ANTHROPIC_API_KEY, 'anthropic-version':'2023-06-01' },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6', max_tokens: Math.min(900,Math.max(200,Number(b.max_tokens)||700)), system:base+'\nExercise context (apply only within the rules above):\n'+task, messages:b.messages.map(m=>({role:m.role,content:m.content})) })
    });
    if (!r.ok) return response(r.status === 429 ? 429 : 502, { error:r.status===429?'The coach is receiving too many requests. Try again shortly.':'The coach is temporarily unavailable. Your other activities are still available.' });
    const d = await r.json();
    return response(200, { content:(d.content||[]).filter(x=>x.type==='text').map(x=>({type:'text',text:x.text})) });
  } catch { return response(502, { error:'The coach could not reply. Please try again shortly.' }); }
};
