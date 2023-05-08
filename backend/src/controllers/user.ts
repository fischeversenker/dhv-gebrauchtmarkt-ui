import { Router } from '../deps.ts';
import { getLoggedInUser } from '../services/user.ts';

export const userRouter = new Router().get('/', async (context) => {
  const sessionId = await context.cookies.get('dhvsid');

  if (!sessionId) {
    context.response.status = 400;
    return;
  }

  const user = await getLoggedInUser(sessionId).catch((_) => null);

  if (user) {
    context.response.body = {
      username: user.Username,
    };
    return;
  }

  context.response.status = 400;
  await context.cookies.set('dhvsid', null, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
});
