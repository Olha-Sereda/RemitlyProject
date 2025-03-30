import { Test, TestingModule } from '@nestjs/testing';
import { SwiftCodeController } from './swift-code.controller';
import { SwiftCodeService } from './swift-code.service';

describe('SwiftCodeController', () => {
  let controller: SwiftCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwiftCodeController],
      providers: [SwiftCodeService],
    }).compile();

    controller = module.get<SwiftCodeController>(SwiftCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
