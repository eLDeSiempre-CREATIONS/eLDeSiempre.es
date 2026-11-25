import { CONFIG } from './config.js';

export class HttpError extends Error {
  constructor(message, status = 0, body = null) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

async function request(path, { method = 'GET', body, credentials = 'include', timeout = 15_000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${CONFIG.API_URL}${path}`, {
      method,
      credentials,
      headers: body
        ? { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        : { 'Accept': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const text = await res.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new HttpError('Respuesta no válida del servidor', res.status, text);
      }
    }

    if (!res.ok) {
      throw new HttpError(data.message || `HTTP ${res.status}`, res.status, data);
    }
    return data;
  } catch (err) {
    if (err.name === 'AbortError') throw new HttpError('Tiempo de espera agotado', 0);
    if (err instanceof HttpError) throw err;
    throw new HttpError('Error de conexión', 0, err);
  } finally {
    clearTimeout(timer);
  }
}

export const http = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
};
