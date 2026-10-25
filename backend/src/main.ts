import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  if (process.env.TRUST_PROXY_LOOPBACK === 'true') {
    app.getHttpAdapter().getInstance().set('trust proxy', 'loopback');
  }
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('JE-Inspi API')
    // .addApiKey({ type: 'apiKey', name: 'admintype', in: 'header' }, 'admintype')
    .addBearerAuth()
    .setDescription('JE-Inspi storefront and administration API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:4001,http://localhost:4002')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // admin.initializeApp({
  //   credential: admin.credential.cert('./resource/serviceAccountKey.json'),
  // });

  await app.listen(process.env.PORT ?? 1631, process.env.HOST ?? '::');

  console.log(`Nest App Started on ${process.env.PORT ?? 1631}`);
  console.log(`http://localhost:${process.env.PORT ?? 1631}/api/`);
}

bootstrap();
