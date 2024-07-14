import crypto from 'crypto';

export const hashToken = (token: string) => crypto.createHash('sha512').update(token).digest('hex');
