import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {
    getHealthCheck: jest.fn().mockReturnValue({
      status: 'ok',
      timestamp: new Date().toISOString(),
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    })
      .overrideProvider(AppService)
      .useValue(mockAppService)
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('healthCheck', () => {
    it('should return health-check status', () => {
      expect(appController.healthCheck()).toEqual({
        status: 'ok',
        timestamp: expect.any(String) as string,
      });
    });
  });
});
