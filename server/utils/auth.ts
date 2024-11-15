import { H3Event, getCookie, setCookie } from 'h3';

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

export const getToken = (event: H3Event): string => {
  let token = getCookie(event, cookieName);

  if (!token) {
    throw new Error('Unauthorized');
  }

  return token;
}