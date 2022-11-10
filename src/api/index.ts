import express from 'express';

import { MessageResponse } from '../interfaces';
import todos from './todo/todo.routes';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '👋 🌎',
  });
});

router.use('/todos', todos);

export default router;
