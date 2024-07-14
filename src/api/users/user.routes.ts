import { Router } from 'express';
import rescue from 'express-rescue';
import type { User } from '@prisma/client';
import { findUserById } from './user.services';

const router = Router();

router.get(
  '/profile',
  rescue(async (req, res) => {
    const { id } = res.locals.payload;

    const user = (await findUserById(id)) as Partial<User>;
    delete user?.password;

    res.json(user);
  }),
);

export default router;
