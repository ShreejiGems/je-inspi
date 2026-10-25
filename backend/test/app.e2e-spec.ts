import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { PrismaService } from '../src/shared/module/prisma/prisma.service';

describe('Health endpoint HTTP integration', () => {
  let app: INestApplication;
  const query = jest.fn();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, { provide: PrismaService, useValue: { prisma: { $queryRaw: query } } }],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => app.close());
  beforeEach(() => query.mockReset());

  it('GET /health returns a database-connected response', async () => {
    query.mockResolvedValueOnce([{ value: 1 }]);
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok', service: 'JE-Inspi API', database: 'connected' });
  });

  it('GET /health returns 503 without leaking database errors', async () => {
    query.mockRejectedValueOnce(new Error('private database connection details'));
    const response = await request(app.getHttpServer()).get('/health').expect(503);
    expect(response.body.message).toBe('JE-Inspi database is unavailable');
    expect(JSON.stringify(response.body)).not.toContain('private database connection details');
  });
});
