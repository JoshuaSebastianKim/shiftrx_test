import prisma from '@/lib/prisma';
import { hashToken } from '@/utils/hashToken';

export const addRefreshTokenToWhitelist = ({
  jwtId,
  refreshToken,
  userId,
}: {
  jwtId: string;
  refreshToken: string;
  userId: string;
}) =>
  prisma.refreshToken.create({
    data: {
      id: jwtId,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });

export const findRefreshTokenById = (id: string) =>
  prisma.refreshToken.findUnique({
    where: {
      id,
    },
  });

export const deleteRefreshToken = (id: string) =>
  prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });

export const revokeTokens = (userId: string) =>
  prisma.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
