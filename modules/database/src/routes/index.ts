
import { Router } from 'express';

import tokensRouter from './tokens';
import teachersRouter from './teachers';
import adminRouter from './administrators';

const router = Router();

router.use(tokensRouter);
router.use(teachersRouter);
router.use(adminRouter);

export default router;
