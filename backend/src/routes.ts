import { Router } from './deps.ts';
import { loginRouter } from './controllers/login.ts';
import { offersRouter } from './controllers/offers.ts';
import { notificationsRouter } from './controllers/notifications.ts';
import { logoutRouter } from './controllers/logout.ts';
import { userRouter } from './controllers/user.ts';
import { musterdatenRouter } from './controllers/musterdaten.ts';

export const router = new Router();
router.use('/user', userRouter.routes(), userRouter.allowedMethods());
router.use('/login', loginRouter.routes(), loginRouter.allowedMethods());
router.use('/logout', logoutRouter.routes(), logoutRouter.allowedMethods());
router.use('/offers', offersRouter.routes(), offersRouter.allowedMethods());
router.use(
  '/notifications',
  notificationsRouter.routes(),
  notificationsRouter.allowedMethods(),
);
router.use(
  '/musterdaten',
  musterdatenRouter.routes(),
  musterdatenRouter.allowedMethods(),
);
