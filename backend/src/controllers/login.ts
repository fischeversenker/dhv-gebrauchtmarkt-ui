import { Router } from '../deps.ts';
import { isUserLoggedIn, login } from '../services/user.ts';

export const loginRouter = new Router()
  .post('/', async (context) => {
    const sessionId = await context.cookies.get('dhvsid');
    if (await isUserLoggedIn(sessionId)) {
      context.response.body = 'is still logged in';
    } else {
      const body = context.request.body();
      if (body.type !== 'form-data') {
        throw new Error('Expected form-data');
      }
      const formData = await body.value.read();
      const { uid, pwd } = formData.fields;
      const newSessionId = await login(uid, pwd, sessionId);
      context.response.body = 'OK';
      await context.cookies.set('dhvsid', newSessionId);
    }
  });
