import { InjectionToken } from '@angular/core';

export class LocalContactDeliveryError extends Error {}

export type ContactDelivery = (payload: URLSearchParams, signal: AbortSignal) => Promise<void>;

/** Netlify intercepts this static path before the Angular SSR handler. */
export async function sendContact(payload: URLSearchParams, signal: AbortSignal): Promise<void> {
  if (location.protocol !== 'https:' || /^(localhost|127\.|\[::1\])/.test(location.hostname)) {
    throw new LocalContactDeliveryError('Contact delivery requires the published Netlify site.');
  }
  const response = await fetch('/__forms.html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload.toString(),
    credentials: 'omit',
    signal,
  });
  if (!response.ok) throw new Error(`Contact rejected: ${response.status}`);
  const content = await response.text();
  // A static/SSR fallback returning 200 is not evidence that Netlify accepted a form.
  if (content.includes('netlify-form-registry') || content.includes('<app-root')) {
    throw new Error('Form handling is not active on this deployment.');
  }
}

export const CONTACT_DELIVERY = new InjectionToken<ContactDelivery>('Contact delivery', {
  providedIn: 'root', factory: () => sendContact,
});
