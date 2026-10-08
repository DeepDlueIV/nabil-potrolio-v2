import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/contact/route';

const brief = { name: 'Ada', email: 'ada@example.com', service: '', summary: 'Please discuss our private AI infrastructure.' };
const request = (body: unknown) => new Request('https://example.com/api/contact', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://example.com' }, body: JSON.stringify(body),
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
describe('contact delivery', () => {
  it('rejects invalid briefs before contacting the provider', async () => {
    expect((await POST(request({ ...brief, email: 'invalid' }))).status).toBe(400);
  });
  it('does not claim success without a configured key', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    expect((await POST(request(brief))).status).toBe(503);
  });
  it('sends to the fixed owner address with the visitor as reply-to', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    let payload: Record<string, unknown> = {};
    vi.stubGlobal('fetch', async (_url: string, init: RequestInit) => {
      payload = JSON.parse(init.body as string);
      return Response.json({ id: 'message-id' });
    });
    const response = await POST(request({ ...brief, to: 'attacker@example.com' }));
    expect(response.status).toBe(200);
    expect(payload.to).toEqual(['nabil.rakdani@codehaus.pro']);
    expect(payload.reply_to).toBe('ada@example.com');
    expect(payload.from).toBe('Nabil Portfolio <website@notify.codehaus.pro>');
    expect(payload.text).toContain(brief.summary);
  });
  it('reports provider rejection instead of success', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    vi.stubGlobal('fetch', async () => Response.json({ message: 'Rejected' }, { status: 403 }));
    expect((await POST(request(brief))).status).toBe(502);
  });
});
