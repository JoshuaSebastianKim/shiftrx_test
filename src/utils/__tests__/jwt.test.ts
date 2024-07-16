import jwtLib from '../jwt';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

describe('JWT', () => {
  describe('#generateAccessToken', () => {
    it('should generate access token using secret', () => {
      const payload = { id: '1', email: 'test@test.com' };
      const token = jwtLib.generateAccessToken(payload);

      expect(token).toEqual(jwt.sign(payload, SECRET, { expiresIn: '1h', algorithm: 'HS256' }));
    });
  });

  describe('#generateRefreshToken', () => {
    it('should generate refresh token using refresh secret', () => {
      const jwtId = 'test';
      const payload = { id: '1', email: 'test@test.com' };
      const token = jwtLib.generateRefreshToken(payload, jwtId);

      expect(token).toEqual(jwt.sign({ ...payload, jwtId }, REFRESH_SECRET, { expiresIn: '8h' }));
    });
  });

  describe('#generateTokens', () => {
    it('should generate tokens', () => {
      const jwtId = 'test';
      const payload = { id: '1', email: 'test@test.com' };
      const tokens = jwtLib.generateTokens(payload, jwtId);

      expect(tokens).toEqual({
        accessToken: jwtLib.generateAccessToken(payload),
        refreshToken: jwtLib.generateRefreshToken(payload, jwtId),
      });
    });
  });
});
