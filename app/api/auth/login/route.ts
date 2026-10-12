import { NextRequest, NextResponse } from 'next/server';
import { checkAdminCredentials, signAdminToken } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const username = (body?.username || '').toString();
    const password = (body?.password || '').toString();

    const matchedUser = checkAdminCredentials(username, password);
    if (!matchedUser) {
      // Small delay to slow down brute force
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json(
        { error: 'Usuário ou senha incorretos' },
        { status: 401 }
      );
    }

    const token = signAdminToken(matchedUser);
    const res = NextResponse.json({ ok: true, token });
    // Also set as httpOnly cookie so the admin UI can rely on cookie auth.
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro no login';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
