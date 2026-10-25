import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSessionType } from 'src/shared/types/user-session.type';

describe('Session revocation', () => {
  const updateMany = jest.fn();
  const findFirst = jest.fn();
  const service = Object.create(AuthService.prototype) as AuthService;
  const session = { user: { id: 'test-admin' } } as UserSessionType;
  Object.assign(service, { userSessionCoreService: { updateMany, findFirst } });

  beforeEach(() => {
    updateMany.mockReset();
    findFirst.mockReset();
  });

  it('revokes the actual bearer token for the current user, including duplicate rows', async () => {
    updateMany.mockResolvedValueOnce({ count: 2 });
    await expect(service.logout({ authorization: 'Bearer test-access-token' }, session))
      .resolves.toEqual({ message: 'Logged out successfully' });
    expect(updateMany).toHaveBeenCalledWith({
      where: { userId: 'test-admin', authToken: 'test-access-token', isDeleted: false },
      data: { isDeleted: true },
    });
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('rejects a logout when there is no active matching session', async () => {
    updateMany.mockResolvedValueOnce({ count: 0 });
    await expect(service.logout({ authorization: 'Bearer test-access-token' }, session))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });

  it.each([undefined, '', 'Basic test-token', 'Bearer', 'Bearer token extra'])
    ('rejects a malformed authorization header: %s', async (authorization) => {
      await expect(service.logout({ authorization }, session)).rejects.toBeInstanceOf(UnauthorizedException);
      expect(updateMany).not.toHaveBeenCalled();
    });

  it('refresh excludes revoked sessions before issuing any new tokens', async () => {
    findFirst.mockResolvedValueOnce(null);
    await expect(service.refreshToken({ authorization: 'Bearer test-refresh-token' })).rejects.toThrow();
    expect(findFirst).toHaveBeenCalledWith({
      where: { refreshToken: 'test-refresh-token', isDeleted: false },
    });
  });
});
