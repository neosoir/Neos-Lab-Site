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

export function getConversationId(): string | null {
  return getCookie('ia_conversation_id');
}

export function setConversationId(conversationId: string): void {
  setCookie('ia_conversation_id', conversationId);
}

export function clearConversationId(): void {
  removeCookie('ia_conversation_id');
}
