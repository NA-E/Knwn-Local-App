/**
 * Supabase REST API client for the Known Local MCP server.
 * Calls PostgREST directly using user's JWT.
 *
 * Auth: Signs in with email/password on startup, auto-refreshes token.
 *
 * NOTE: RLS is ENABLED in Known Local's Supabase project.
 * Access control is handled entirely by RLS policies — no need for
 * created_by filtering in application code.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

// ============================================================================
// Auth Session Management
// ============================================================================

interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp (seconds)
  userId: string;
}

let session: AuthSession | null = null;

/**
 * Sign in with email/password and store session tokens.
 * Called once on startup.
 */
export async function signIn(email: string, password: string): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json() as { msg?: string };
    throw new Error(`Auth failed: ${error.msg || response.statusText}`);
  }

  const data = await response.json() as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: { id: string };
  };

  session = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Math.floor(Date.now() / 1000) + data.expires_in - 60, // refresh 60s early
    userId: data.user.id,
  };

  console.error(`Signed in as ${email} (${data.user.id})`);
}

/**
 * Refresh the access token using the refresh token.
 * Called automatically when token is about to expire.
 */
async function refreshSession(): Promise<void> {
  if (!session) throw new Error('No session to refresh');

  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: session.refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Token refresh failed — re-sign-in required');
  }

  const data = await response.json() as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };

  session = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Math.floor(Date.now() / 1000) + data.expires_in - 60,
    userId: session.userId,
  };

  console.error('Token refreshed');
}

/**
 * Get the authenticated user's ID.
 */
export function getUserId(): string {
  if (!session) throw new Error('Not signed in');
  return session.userId;
}

/**
 * Get a valid access token, refreshing if needed.
 */
export async function getAccessToken(): Promise<string> {
  if (!session) throw new Error('Not signed in');

  const now = Math.floor(Date.now() / 1000);
  if (now >= session.expiresAt) {
    await refreshSession();
  }

  return session.accessToken;
}

// ============================================================================
// Query Helpers
// ============================================================================

interface SupabaseQueryOptions {
  table: string;
  select?: string;
  filters?: Record<string, string>;
  order?: string;
  limit?: number;
}

/**
 * Query rows from a Supabase table via PostgREST.
 * Filters use PostgREST operators (e.g., `name: 'ilike.*search*'`, `status: 'eq.active'`).
 */
export async function supabaseQuery<T>(options: SupabaseQueryOptions): Promise<T> {
  const token = await getAccessToken();
  const { table, select = '*', filters = {}, order, limit } = options;

  const params = new URLSearchParams();
  params.set('select', select);

  for (const [key, value] of Object.entries(filters)) {
    params.set(key, value);
  }

  if (order) {
    params.set('order', order);
  }

  if (limit) {
    params.set('limit', String(limit));
  }

  const url = `${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase query error (${response.status}): ${errorText}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Insert a row into a Supabase table via PostgREST.
 * Returns the inserted row (uses Prefer: return=representation).
 */
export async function supabaseInsert<T>(table: string, body: Record<string, unknown>): Promise<T> {
  const token = await getAccessToken();
  const url = `${SUPABASE_URL}/rest/v1/${table}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase insert error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  // PostgREST returns an array even for single inserts
  return (Array.isArray(data) ? data[0] : data) as T;
}

/**
 * Update rows in a Supabase table via PostgREST PATCH.
 * Filters determine which rows to update.
 * Returns the updated row(s).
 */
export async function supabaseUpdate<T>(
  table: string,
  body: Record<string, unknown>,
  filters: Record<string, string>
): Promise<T> {
  const token = await getAccessToken();

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    params.set(key, value);
  }

  const url = `${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase update error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return (Array.isArray(data) ? data[0] : data) as T;
}

/**
 * Delete rows from a Supabase table via PostgREST DELETE.
 * Filters determine which rows to delete.
 */
export async function supabaseDelete(
  table: string,
  filters: Record<string, string>
): Promise<void> {
  const token = await getAccessToken();

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    params.set(key, value);
  }

  const url = `${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase delete error (${response.status}): ${errorText}`);
  }
}
