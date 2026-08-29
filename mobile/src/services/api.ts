import axios from 'axios';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3333/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
}

export function resolveAssetUrl(path?: string | null) {
  if (!path) {
    return undefined;
  }

  if (path.startsWith('http')) {
    return path;
  }

  return `${API_BASE_URL.replace('/api', '')}${path}`;
}

