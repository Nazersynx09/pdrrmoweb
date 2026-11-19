import { createClient } from '@supabase/supabase-js';

const allowedAdminEmails = new Set(
  (process.env.ADMIN_ALLOWED_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

export function isAdminEmail(email: string | null | undefined) {
  return Boolean(email && allowedAdminEmails.has(email.trim().toLowerCase()));
}

export async function getAuthenticatedUserFromToken(token: string) {
  if (!token) return null;
  const verifier = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user }, error } = await verifier.auth.getUser(token);
  if (error || !user) return null;

  return user;
}

export async function getAuthenticatedUser(request: Request) {
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return null;

  const token = authorization.slice('Bearer '.length).trim();
  return getAuthenticatedUserFromToken(token);
}

export async function getAdminClient(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user || !isAdminEmail(user.email)) return null;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}