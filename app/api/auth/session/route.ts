import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      // Not logged in is a normal state, not an error: empty 200 response
      return new NextResponse(null, { status: 200 });
    }

    // Call backend to refresh tokens using refreshToken cookie
    const apiRes = await api.get('auth/session', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const setCookie = apiRes.headers['set-cookie'];

    // Update refreshToken cookie if backend sends a new one
    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path || '/',
          maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
          httpOnly: true,
          secure: true,
        };

        if (parsed.refreshToken) {
          cookieStore.set('refreshToken', parsed.refreshToken, options);
        }
        if (parsed.sessionId) {
          cookieStore.set('sessionId', parsed.sessionId, options);
        }
      }
    }

    // Return response with accessToken in body (client stores in memory)
    return NextResponse.json(apiRes.data, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      const status = error.response?.status;

      // Invalid/expired session (or backend unreachable without a response
      // status) is "not authenticated": clear stale cookies so middleware
      // stops redirecting the user away from /sign-in and /sign-up
      if (!status || status === 400 || status === 401 || status === 403) {
        const res = new NextResponse(null, { status: 200 });
        res.cookies.delete('refreshToken');
        res.cookies.delete('sessionId');
        return res;
      }

      return NextResponse.json(
        { error: 'Session refresh failed' },
        { status },
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
