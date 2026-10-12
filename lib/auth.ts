import crypto from 'crypto';
import { NextRequest } from 'next/server';

// Server-only secrets (NO NEXT_PUBLIC prefix)
function getSecret(): string {
  return (
    process.env.JWT_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    // Fallback used only when both are unset — not useful for attackers because
    // the login route also requires an admin to be configured.
    'change-me-set-JWT_SECRET-in-vercel'
  );
}

interface AdminUser {
  username: string;
  password: string;
}

/**
 * Reads the list of admin users from env vars.
 *
 * Primary format (recommended):
 *   ADMIN_USERS="joao:pass123,leticia:pass456"
 *
 * Legacy fallback (single user):
 *   ADMIN_USERNAME / NEXT_PUBLIC_ADMIN_USERNAME
 *   ADMIN_PASSWORD / NEXT_PUBLIC_ADMIN_PASSWORD
 */
function getAdminUsers(): AdminUser[] {
  const list: AdminUser[] = [];

  // Primary: ADMIN_USERS "user1:pass1,user2:pass2"
  const multi = process.env.ADMIN_USERS;
  if (multi && multi.trim().length > 0) {
    for (const entry of multi.split(',')) {
      const [u, ...rest] = entry.split(':');
      const p = rest.join(':'); // allow colons in password
      if (u && p && u.trim().length > 0 && p.trim().length > 0) {
        list.push({ username: u.trim(), password: p });
      }
    }
  }

  // Legacy single-user fallback
  const legacyUser =
    process.env.ADMIN_USERNAME ||
    process.env.NEXT_PUBLIC_ADMIN_USERNAME ||
    '';
  const legacyPass =
    process.env.ADMIN_PASSWORD ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    '';
  if (legacyUser && legacyPass && !list.some((u) => u.username === legacyUser)) {
    list.push({ username: legacyUser, password: legacyPass });
  }

  return list;
}

// Timing-safe string compare
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

// Minimal signed-token format: base64url(payload).base64url(hmacSha256(payload))
// payload = JSON { sub: '<username>', iat, exp }
function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(s: string): Buffer {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Buffer.from(s, 'base64');
}

export interface AdminTokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

export function signAdminToken(username: string, ttlSeconds: number = 60 * 60 * 24 * 7): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminTokenPayload = { sub: username, iat: now, exp: now + ttlSeconds };
  const payloadStr = b64url(Buffer.from(JSON.stringify(payload)));
  const sig = crypto.createHmac('sha256', getSecret()).update(payloadStr).digest();
  return `${payloadStr}.${b64url(sig)}`;
}

export function verifyAdminToken(token: string | null | undefined): AdminTokenPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadStr, sigStr] = parts;
  const expected = b64url(
    crypto.createHmac('sha256', getSecret()).update(payloadStr).digest()
  );
  if (!safeEqual(sigStr, expected)) return null;
  try {
    const payload = JSON.parse(b64urlDecode(payloadStr).toString('utf8')) as AdminTokenPayload;
    if (!payload || !payload.sub || typeof payload.sub !== 'string') return null;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Returns the matched admin username on success, or null on failure.
 */
export function checkAdminCredentials(username: string, password: string): string | null {
  if (!username || !password) return null;
  const users = getAdminUsers();
  if (users.length === 0) return null;

  for (const u of users) {
    // Compare both fields in timing-safe way (same length check)
    if (
      Buffer.byteLength(username) === Buffer.byteLength(u.username) &&
      safeEqual(username, u.username) &&
      Buffer.byteLength(password) === Buffer.byteLength(u.password) &&
      safeEqual(password, u.password)
    ) {
      return u.username;
    }
  }
  return null;
}

export function validateRequestAdmin(request: NextRequest): boolean {
  // Accept either Authorization: Bearer <token> or a cookie named `admin_token`.
  const header = request.headers.get('authorization') || '';
  const bearer = header.toLowerCase().startsWith('bearer ')
    ? header.slice(7).trim()
    : '';
  const cookie = request.cookies.get('admin_token')?.value || '';
  const token = bearer || cookie;
  return !!verifyAdminToken(token);
}
