import express from 'express';
import { clear, setup } from '@/utils';

const initRouter = express.Router();

// POST /api/init
initRouter.post('/', async (req, res) => {
  await clear();
  await setup();
  res.send('OK');
});

export default initRouter;
