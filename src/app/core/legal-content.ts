// Complete with the client's approved policy before publishing a final policy.
// The brand and the project's address do not identify the legal data controller.
export interface LegalResponsible {
  legalName: string;
  nit: string;
  notificationAddress: string;
  privacyEmail: string;
}

export const LEGAL_CONTENT: {
  version: string;
  privacyDraft: boolean;
  responsible: LegalResponsible | null;
  retention: string | null;
  requestProcedure: string | null;
} = {
  version: '2026-10-09',
  privacyDraft: true,
  responsible: null,
  retention: null,
  requestProcedure: null,
};

// One source for the checkbox and the authorization included in the WhatsApp draft.
export const CONTACT_AUTHORIZATION =
  'Autorizo que Girardot Express use estos datos para responder mi solicitud y que se compartan con WhatsApp al continuar. He leído la información de privacidad.';

export const CONTACT_LIMITS = {
  name: 100, phone: 32, email: 254, company: 150,
  role: 100, category: 100, area: 100, message: 1000,
} as const;
