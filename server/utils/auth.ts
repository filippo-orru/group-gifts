import { H3Event, getCookie, setCookie } from 'h3';
import cookie from 'cookie';
import { randomBytes } from 'crypto';

const cookieName = 'gg-token';

export const setTokenIfNeeded = (event: H3Event)  => {
  let token = getCookie(event, cookieName);

  if (!token) {
    token = Buffer.from(randomBytes(32)).toString('base64url')
    console.log('Creating new token', token);
    setCookie(event, cookieName, token, { path: "/", httpOnly: true, sameSite: 'strict' });
  }
}

// "One token per device"
// User can join multiple groups with this token
// User can join the same group multiple times with separate devices (= separate tokens). E.g. phone and laptop.
//  but user has to accept the invite separately for every device.

export const getToken = (event: H3Event): string => {
  let token = getCookie(event, cookieName);

  if (!token) {
    throw new Error('Unauthorized');
  }

  return token;
}

export const getTokenFromRequest = (request: { headers: Headers; }): string => {
  // Get token from cookie
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
      throw new Error('Missing cookie');
  }
  const token = cookie.parse(cookieHeader)[cookieName];
  if (!token) {
      throw new Error('Missing token');
  }
  return token;
}