import { sendContact, LocalContactDeliveryError } from './contact-delivery';

describe('Netlify contact transport', () => {
  afterEach(() => vi.unstubAllGlobals());
  const payload = new URLSearchParams({ 'form-name': 'contacto-general', name: 'Ana & José', email: 'ana@example.com' });
  function published() { vi.stubGlobal('location', { protocol: 'https:', hostname: 'girardotexpress.com.co' }); }

  it('posts encoded data and propagates cancellation', async () => {
    published(); const request = vi.fn().mockResolvedValue(new Response('Thank you', { status: 200 })); vi.stubGlobal('fetch', request);
    const signal = new AbortController().signal; await sendContact(payload, signal);
    expect(request).toHaveBeenCalledWith('/__forms.html', expect.objectContaining({ method: 'POST', body: payload.toString(), signal, credentials: 'omit' }));
  });
  it.each([400, 404, 429, 500])('rejects unsuccessful status %s', async status => {
    published(); vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status })));
    await expect(sendContact(payload, new AbortController().signal)).rejects.toThrow('Contact rejected');
  });
  it.each(['<meta name="netlify-form-registry">', '<app-root></app-root>'])('rejects a static/SSR fallback', async content => {
    published(); vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(content)));
    await expect(sendContact(payload, new AbortController().signal)).rejects.toThrow('not active');
  });
  it('does not pretend to send from localhost', async () => {
    vi.stubGlobal('location', { protocol: 'http:', hostname: 'localhost' }); const request=vi.fn(); vi.stubGlobal('fetch', request);
    await expect(sendContact(payload, new AbortController().signal)).rejects.toBeInstanceOf(LocalContactDeliveryError);
    expect(request).not.toHaveBeenCalled();
  });
});
