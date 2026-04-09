const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name: string, value: string, maxAge: number = COOKIE_MAX_AGE): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)};max-age=${maxAge};path=/;SameSite=Lax`;
}

export function removeCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;max-age=0;path=/`;
}

export function getOrCreateDeviceId(): string {
  let deviceId = getCookie('ia_device_id');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    setCookie('ia_device_id', deviceId);
  }
  return deviceId;
}

export function getSessionId(): string | null {
  return getCookie('ia_session_id');
}

export function setSessionId(sessionId: string): void {
  setCookie('ia_session_id', sessionId);
}

export function clearSessionId(): void {
  removeCookie('ia_session_id');
}