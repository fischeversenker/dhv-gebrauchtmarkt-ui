import { Router } from 'https://deno.land/x/oak@v10.5.1/mod.ts';
import { loginRouter } from './controllers/login.ts';
import { offersRouter } from './controllers/offers.ts';

export const router = new Router();
router.use('/login', loginRouter.routes(), loginRouter.allowedMethods());
router.use('/offers', offersRouter.routes(), offersRouter.allowedMethods());
