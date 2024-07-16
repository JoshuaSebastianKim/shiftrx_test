import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({
    where: {
      email,
    },
  });

export const findUserById = (id: string) =>
  prisma.user.findUnique({
    where: {
      id,
    },
  });

export const createUserByEmailAndPassword = (user: { email: string; password: string }) => {
  user.password = bcrypt.hashSync(user.password, 12);
  return prisma.user.create({
    data: user,
  });
};
