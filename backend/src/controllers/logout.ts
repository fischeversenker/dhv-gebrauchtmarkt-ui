import { Router } from '../deps.ts';
import { isUserLoggedIn, logout } from '../services/user.ts';

export const logoutRouter = new Router().get('/', async (context) => {
  const sessionId = await context.cookies.get('dhvsid');

  if (!sessionId || (await isUserLoggedIn(sessionId))) {
    context.response.body = 'OK';
    await context.cookies.set('dhvsid', null, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return;
  }

  const logoutResponse = await logout(sessionId);
  context.response.body = logoutResponse.body;
  context.response.status = logoutResponse.status;
});
