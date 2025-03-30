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
      host: process.env.DB_HOST || 'db',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'yourpassword',
      database: process.env.DB_NAME || 'swift_db',
      entities: [SwiftCode],
      synchronize: true,
      logging: true,
    }),
    SwiftCodeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
