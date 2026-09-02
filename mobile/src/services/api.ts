import Constants from 'expo-constants';
import { Platform } from 'react-native';
import axios from 'axios';

function normalizeApiUrl(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed.replace(/\/+$/, '');
}

function getHostnameFromUri(uri?: string | null) {
  if (!uri) {
    return undefined;
  }

  const withoutProtocol = uri.replace(/^[a-z]+:\/\//i, '');
  const hostWithPort = withoutProtocol.split('/')[0];
  const host = hostWithPort.split(':')[0];

  return host || undefined;
}

function isLocalhostUrl(url: string) {
  try {
    const { hostname } = new URL(url);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function getExpoDevApiUrl() {
  const host =
    getHostnameFromUri(Constants.expoConfig?.hostUri) ??
    getHostnameFromUri(Constants.platform?.hostUri) ??
    getHostnameFromUri(Constants.linkingUri);

  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return undefined;
  }

  return `http://${host}:3333/api`;
}

function resolveApiBaseUrl() {
  const envUrl = normalizeApiUrl(process.env.EXPO_PUBLIC_API_URL);

  if (envUrl && (Platform.OS === 'web' || !isLocalhostUrl(envUrl))) {
    return envUrl;
  }

  return getExpoDevApiUrl() ?? envUrl ?? 'http://localhost:3333/api';
}

export const API_BASE_URL = resolveApiBaseUrl();
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

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

  return `${API_ORIGIN}${path}`;
}
