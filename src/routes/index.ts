import { Router } from 'express';
import userRoutes from './api/userRoutes.js';
import thoughtRoutes from './api/thoughtRoutes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

router.use((_req, res) => {
  return res.send('Wrong route!');
});

export default router;
