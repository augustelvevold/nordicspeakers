// Cloudflare Pages Function — booking inquiry endpoint (POST /api/book).
// Runs on Cloudflare's runtime; NOT part of the Astro static build (Astro only
// builds src/). Cloudflare Pages serves dist/ and runs this alongside it.
//
// Delivery is env-configured so no secret lives in the repo. To receive
// inquiries, set these in the Pages project (Settings → Environment variables):
//   RESEND_API_KEY     — Resend API key
//   BOOKING_TO_EMAIL   — inbox that should receive inquiries
//   BOOKING_FROM_EMAIL — optional verified sender (defaults below)
// TODO(config): add those before go-live. Until then the endpoint validates and
// accepts submissions but does not deliver (no error shown to the visitor).

interface Env {
  RESEND_API_KEY?: string;
  BOOKING_TO_EMAIL?: string;
  BOOKING_FROM_EMAIL?: string;
}

export interface BookingInput {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
  subject?: string;
  date?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Pure validation — unit-testable without the Cloudflare runtime. */
export function validateBooking(
  data: Record<string, string>,
): { ok: true; value: BookingInput } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const name = (data.name ?? '').trim();
  const email = (data.email ?? '').trim();
  const message = (data.message ?? '').trim();
  if (name.length < 2) errors.push('Fyll inn navn.');
  if (!EMAIL_RE.test(email)) errors.push('Fyll inn en gyldig e-postadresse.');
  if (message.length < 5) errors.push('Skriv en kort melding.');
  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      name,
      email,
      message,
      company: (data.company ?? '').trim() || undefined,
      phone: (data.phone ?? '').trim() || undefined,
      subject: (data.subject ?? '').trim() || undefined,
      date: (data.date ?? '').trim() || undefined,
    },
  };
}

async function deliver(input: BookingInput, env: Env): Promise<void> {
  if (!env.RESEND_API_KEY || !env.BOOKING_TO_EMAIL) return; // not configured yet
  const text = [
    `Navn: ${input.name}`,
    `E-post: ${input.email}`,
    input.company ? `Bedrift: ${input.company}` : null,
    input.phone ? `Telefon: ${input.phone}` : null,
    input.subject ? `Tema/foredragsholder: ${input.subject}` : null,
    input.date ? `Ønsket dato: ${input.date}` : null,
    '',
    input.message,
  ]
    .filter(Boolean)
    .join('\n');

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.BOOKING_FROM_EMAIL ?? 'Nordic Speakers <booking@nordicspeakers.no>',
      to: [env.BOOKING_TO_EMAIL],
      reply_to: input.email,
      subject: `Ny bookingforespørsel: ${input.name}`,
      text,
    }),
  });
}

function wantsJson(request: Request): boolean {
  return (request.headers.get('accept') ?? '').includes('application/json');
}

function done(request: Request): Response {
  return wantsJson(request)
    ? new Response(JSON.stringify({ ok: true }), {
        headers: { 'content-type': 'application/json' },
      })
    : new Response(null, { status: 303, headers: { Location: '/takk/' } });
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    // Malformed / non-form body (e.g. a bot probe) — respond cleanly, don't throw.
    return wantsJson(request)
      ? new Response(JSON.stringify({ ok: false, errors: ['Ugyldig skjemadata.'] }), {
          status: 400,
          headers: { 'content-type': 'application/json' },
        })
      : new Response('Ugyldig skjemadata.', {
          status: 400,
          headers: { 'content-type': 'text/plain; charset=utf-8' },
        });
  }
  const field = (k: string): string => {
    const v = form.get(k);
    return typeof v === 'string' ? v : '';
  };
  const data: Record<string, string> = {
    name: field('name'),
    email: field('email'),
    message: field('message'),
    company: field('company'),
    phone: field('phone'),
    subject: field('subject'),
    date: field('date'),
    company_url: field('company_url'),
  };

  // Honeypot — bots fill this hidden field; humans never see it. Drop silently.
  if ((data.company_url ?? '').trim() !== '') return done(request);

  const result = validateBooking(data);
  if (!result.ok) {
    if (wantsJson(request)) {
      return new Response(JSON.stringify({ ok: false, errors: result.errors }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }
    return new Response(`Skjemaet mangler informasjon: ${result.errors.join(' ')}`, {
      status: 400,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  try {
    await deliver(result.value, env);
  } catch {
    // Never leak provider errors to the visitor; still acknowledge receipt.
  }
  return done(request);
}
