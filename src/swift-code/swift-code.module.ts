import { Module } from '@nestjs/common';
import { SwiftCodeService } from './swift-code.service';
import { SwiftCodeController } from './swift-code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwiftCode } from './entities/swift-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SwiftCode])], // <-- required import
  controllers: [SwiftCodeController],
  providers: [SwiftCodeService],
  exports: [SwiftCodeService],
})
export class SwiftCodeModule {}
