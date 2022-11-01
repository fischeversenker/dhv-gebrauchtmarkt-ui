import { Router } from './deps.ts';
import { loginRouter } from './controllers/login.ts';
import { offersRouter } from './controllers/offers.ts';
import { notificationsRouter } from './controllers/notifications.ts';

export const router = new Router();
router.use('/login', loginRouter.routes(), loginRouter.allowedMethods());
router.use('/offers', offersRouter.routes(), offersRouter.allowedMethods());
router.use('/notifications', notificationsRouter.routes(), notificationsRouter.allowedMethods());
