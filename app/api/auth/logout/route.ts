import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Send logout request with cookies (refreshToken needed for backend)
    await api.post('auth/logout', null, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    // Clear cookies
    cookieStore.delete('refreshToken');
    cookieStore.delete('sessionId');

    // Return 204 No Content (matching backend behavior)
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      // Still clear cookies even if backend fails
      const cookieStore = await cookies();
      cookieStore.delete('refreshToken');
      cookieStore.delete('sessionId');
      return new NextResponse(null, { status: 204 });
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
