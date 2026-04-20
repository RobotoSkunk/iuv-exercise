
import { Router } from 'express';

import adminRouter from './administrators';
import rolesRouter from './roles';
import teachersRouter from './teachers';
import tokensRouter from './tokens';

const router = Router();

router.use(adminRouter);
router.use(rolesRouter);
router.use(teachersRouter);
router.use(tokensRouter);

export default router;
