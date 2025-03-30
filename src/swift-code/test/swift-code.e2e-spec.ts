import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

// Define types for response structure
interface SwiftCodesResponse {
  countryISO2: string;
  countryName: string;
  swiftCodes: {
    swiftCode: string;
    countryISO2: string;
    bankName: string;
    address: string;
    isHeadquarter: boolean;
  }[];
}

describe('SwiftCodesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1/swift-codes/{swift-code} (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/swift-codes/SWIFTCODE123')
      .expect(200)
      .expect((res) => {
        // Use type assertion directly in the `expect` statement
        const responseBody = res.body as SwiftCodesResponse; // Cast to the expected type
        expect(responseBody).toHaveProperty('swiftCode', 'SWIFTCODE123');
      });
  });

  it('/v1/swift-codes/country/{countryISO2code} (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/swift-codes/country/US')
      .expect(200)
      .expect((res) => {
        // Cast response to SwiftCodesResponse
        const responseBody = res.body as SwiftCodesResponse; // Cast here too
        expect(responseBody).toHaveProperty('countryISO2', 'US');
        expect(Array.isArray(responseBody.swiftCodes)).toBe(true);
      });
  });

  it('/v1/swift-codes (POST)', () => {
    return request(app.getHttpServer())
      .post('/v1/swift-codes')
      .send({
        swiftCode: 'TESTCODEXXX',
        countryISO2: 'US',
        bankName: 'Test Bank',
        address: 'Test Address',
        countryName: 'UNITED STATES',
        isHeadquarter: true,
      })
      .expect(201)
      .expect({
        message: 'Swift code created successfully',
      });
  });

  it('/v1/swift-codes/{swift-code} (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/v1/swift-codes/TESTCODEXXX')
      .expect(200)
      .expect({
        message: 'Swift code deleted successfully',
      });
  });
});
