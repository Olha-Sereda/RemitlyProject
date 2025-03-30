import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SwiftCode } from './swift-code/entities/swift-code.entity';
import { SwiftCodeModule } from './swift-code/swift-code.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'simform',
      username: 'lunar',
      entities: [SwiftCode],
      database: 'pgwithnest',
      synchronize: true,
      logging: true,
    }),
    SwiftCodeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
