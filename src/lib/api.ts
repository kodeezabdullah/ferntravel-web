import { supabase } from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse(res: Response) {
  if (res.status === 204) return null;

  const body = await res.json().catch(() => null);

  if (!res.ok || body?.error) {
    const code = body?.error?.code ?? 'UNKNOWN_ERROR';
    const message = body?.error?.message ?? `Request failed with status ${res.status}`;
    throw new ApiError(res.status, code, message);
  }

  return body?.data ?? body;
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const authHeader = await getAuthHeader();
  const url = `${API_BASE_URL}${path}`;

  const isJsonBody = options.body !== undefined && !(options.body instanceof FormData);

  const doFetch = (headers: Record<string, string>) =>
    fetch(url, {
      ...options,
      headers: {
        ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
        ...(options.headers as Record<string, string> | undefined),
      },
      body: isJsonBody ? JSON.stringify(options.body) : (options.body as BodyInit | undefined),
    });

  let res = await doFetch(authHeader);

  if (res.status === 401) {
    const { data, error } = await supabase.auth.refreshSession();
    if (!error && data.session) {
      res = await doFetch({ Authorization: `Bearer ${data.session.access_token}` });
    }
  }

  return parseResponse(res) as Promise<T>;
}

// For non-JSON responses (e.g. CSV exports) where apiFetch's res.json() parsing doesn't apply.
export async function apiFetchRaw(path: string, options: RequestInit = {}): Promise<Response> {
  const authHeader = await getAuthHeader();
  const url = `${API_BASE_URL}${path}`;
  const baseHeaders = options.headers as Record<string, string> | undefined;
  let res = await fetch(url, { ...options, headers: { ...authHeader, ...baseHeaders } });

  if (res.status === 401) {
    const { data, error } = await supabase.auth.refreshSession();
    if (!error && data.session) {
      res = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
          ...baseHeaders,
        },
      });
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.error?.code ?? 'UNKNOWN_ERROR', body?.error?.message ?? `Request failed with status ${res.status}`);
  }

  return res;
}

export async function apiUpload<T = unknown>(
  path: string,
  file: File,
  fields: { purpose: string; kind: 'image' | 'voice' },
): Promise<T> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('purpose', fields.purpose);
  formData.append('kind', fields.kind);

  return apiFetch<T>(path, { method: 'POST', body: formData });
}
