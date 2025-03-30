import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { SwiftCodeService } from '../src/swift-code/swift-code.service';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const swiftCodeService = app.get(SwiftCodeService);
  const filePath = path.resolve(__dirname, '../src/data/swift-codes.csv');
  await swiftCodeService.parseAndInsertCSV(filePath);
  await app.close();
}

bootstrap();
