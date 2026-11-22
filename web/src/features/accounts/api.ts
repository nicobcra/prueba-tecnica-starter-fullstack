const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface AccountNode {
    code: string;
    name: string;
    level: string;
    nature: string;
    children: AccountNode[];
}

export class ApiError extends Error {
  field: string | null;

  constructor(field: string | null, message: string) {
    super(message);
    this.field = field;
  }
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, init);
  } catch {
    throw new ApiError(null, 'No se pudo conectar con el servidor');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.field ?? null, body?.message ?? 'Error inesperado');
  }
  return res;
}

export async function getTree(): Promise<AccountNode[]> {
  return (await request('/accounts')).json();
}

export async function createAccount(input: { code: string; name: string; nature?: string }) {
  await request('/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function deleteAccount(code: string) {
  await request(`/accounts/${code}`, { method: 'DELETE' });
}