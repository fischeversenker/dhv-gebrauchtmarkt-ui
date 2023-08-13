import { Context, Router } from '../deps.ts';
import { getLoggedInUser, User } from '../services/user.ts';

export const requireAuthMiddleware = async (
  context: Context,
  next: () => Promise<unknown>,
) => {
  const sessionId = await context.cookies.get('dhvsid');

  if (!sessionId) {
    context.response.status = 401;
    context.response.body = 'Unauthorized';
    await context.cookies.set('dhvsid', null, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return;
  }

  const user = await getLoggedInUser(sessionId).catch((_) => null);

  if (!user) {
    context.response.status = 401;
    context.response.body = 'Unauthorized';
    await context.cookies.set('dhvsid', null, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return;
  }

  context.state.user = user;
  await next();
};

interface SavedSearch {
  id: string;
}

export const userRouter = new Router<{ user: User }>()
  .use(requireAuthMiddleware)
  .get('/', (context) => {
    context.response.body = context.state.user;
  })
  .get('/saved-search', async (context) => {
    const kv = await Deno.openKv();
    context.response.body = await kv.get([
      'users',
      context.state.user.userID,
      'savedSearches',
    ]);
  })
  .post('/saved-search', async (context) => {
    const newSavedSearch = await context.request.body().value;
    newSavedSearch.id = Math.random().toString(36).substring(2, 9);

    const kv = await Deno.openKv();
    const existingSavedSearches = await kv.get<SavedSearch[]>([
      'users',
      context.state.user.userID,
      'savedSearches',
    ]);

    await kv.set(
      ['users', context.state.user.userID, 'savedSearches'],
      [newSavedSearch, ...(existingSavedSearches.value ?? [])],
    );

    const res = await kv.get([
      'users',
      context.state.user.userID,
      'savedSearches',
    ]);
    context.response.body = res;
  })
  .delete('/saved-search/:id', async (context) => {
    const kv = await Deno.openKv();

    const existingSavedSearches = await kv.get<SavedSearch[]>([
      'users',
      context.state.user.userID,
      'savedSearches',
    ]);
    // TODO: throw an error if id not found
    const newSavedSearches = existingSavedSearches.value?.filter(
      (s) => s.id !== context.params.id,
    );
    await kv.set(
      ['users', context.state.user.userID, 'savedSearches'],
      newSavedSearches ?? [],
    );

    context.response.body = [];
  });
