import { ServiceUnavailableException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './shared/module/prisma/prisma.service';

describe('Database health', () => {
  const query = jest.fn();
  const controller = new AppController(
    new AppService(),
    { prisma: { $queryRaw: query } } as unknown as PrismaService,
  );

  beforeEach(() => query.mockReset());

  it('checks the database before reporting a healthy API', async () => {
    query.mockResolvedValueOnce([{ value: 1 }]);
    await expect(controller.health()).resolves.toEqual({
      status: 'ok', service: 'JE-Inspi API', database: 'connected',
    });
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('returns a sanitized service error when the database fails', async () => {
    query.mockRejectedValueOnce(new Error('private database connection details'));
    await expect(controller.health()).rejects.toEqual(
      new ServiceUnavailableException('JE-Inspi database is unavailable'),
    );
  });
});
