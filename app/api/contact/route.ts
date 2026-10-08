import { buildProjectBrief, type ProjectBriefInput } from '@/lib/contact/brief';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: 'Request not allowed.' }, { status: 403 });
  }
  if (Number(request.headers.get('content-length')) > 20000) {
    return Response.json({ error: 'Message too large.' }, { status: 413 });
  }
  let input: ProjectBriefInput & { website?: string };
  try {
    const raw = await request.text();
    if (raw.length > 20000) return Response.json({ error: 'Message too large.' }, { status: 413 });
    input = JSON.parse(raw);
  } catch {
    return Response.json({ error: 'Invalid message.' }, { status: 400 });
  }
  if (!input || typeof input.name !== 'string' || !input.name.trim() || input.name.length > 120
    || typeof input.email !== 'string' || input.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())
    || typeof input.summary !== 'string' || input.summary.trim().length < 20 || input.summary.length > 5000
    || typeof input.service !== 'string' || input.service.length > 100 || input.website) {
    return Response.json({ error: 'Check your name, email and message.' }, { status: 400 });
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ error: 'Email sending is unavailable. Please try again later.' }, { status: 503 });
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Nabil Portfolio <website@notify.codehaus.pro>',
        to: ['nabil.rakdani@codehaus.pro'],
        reply_to: input.email.trim(),
        subject: `Project brief from ${input.name.trim().replace(/[\r\n]/g, ' ')}`,
        text: buildProjectBrief(input),
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      console.error('Отправка контактной формы отклонена Resend:', response.status);
      return Response.json({ error: 'Could not send. Please try again later.' }, { status: 502 });
    }
    const result = await response.json();
    if (!result.id) return Response.json({ error: 'Could not confirm sending. Please try again later.' }, { status: 502 });
    return Response.json({ success: true });
  } catch {
    console.error('Ошибка подключения к Resend при отправке контактной формы.');
    return Response.json({ error: 'Could not send. Please try again later.' }, { status: 502 });
  }
}
