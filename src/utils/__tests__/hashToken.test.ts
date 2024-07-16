import crypto from 'crypto';
import { hashToken } from '../hashToken';

describe('hashToken', () => {
  it('should return a hashed token', () => {
    const token = 'test';

    expect(hashToken(token)).toEqual(crypto.createHash('sha512').update(token).digest('hex'));
  });
});
