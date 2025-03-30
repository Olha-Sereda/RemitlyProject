import { Test, TestingModule } from '@nestjs/testing';
import { SwiftCodeService } from './swift-code.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SwiftCode } from './entities/swift-code.entity';

// Mock the repository
const mockSwiftCodeRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('SwiftCodeService', () => {
  let service: SwiftCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SwiftCodeService,
        {
          provide: getRepositoryToken(SwiftCode),
          useValue: mockSwiftCodeRepository, // Use the mock repository here
        },
      ],
    }).compile();

    service = module.get<SwiftCodeService>(SwiftCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findOne method of the repository', async () => {
    mockSwiftCodeRepository.findOne.mockResolvedValue({} as SwiftCode);
    await service.findOne('SWIFTCODE123');
    expect(mockSwiftCodeRepository.findOne).toHaveBeenCalledWith({
      where: { swiftCode: 'SWIFTCODE123' },
    });
  });

  it('should call findAll method of the repository', async () => {
    const swiftCodes = [
      { swiftCode: 'SWIFTCODE123' },
      { swiftCode: 'SWIFTCODE456' },
    ];
    mockSwiftCodeRepository.find.mockResolvedValue(swiftCodes);
    const result = await service.findAll();
    expect(result).toEqual(swiftCodes);
    expect(mockSwiftCodeRepository.find).toHaveBeenCalled();
  });

  it('should create a new swift code', async () => {
    const createSwiftCodeDto = {
      swiftCode: 'TESTCODE123',
      countryISO2: 'US',
      bankName: 'Test Bank',
      address: 'Test Address',
      countryName: 'UNITED STATES',
      isHeadquarter: true,
    };
    mockSwiftCodeRepository.save.mockResolvedValue(createSwiftCodeDto);
    const result = await service.createSwiftCode(createSwiftCodeDto);
    expect(result).toEqual({ message: 'Swift code created successfully' });
    expect(mockSwiftCodeRepository.save).toHaveBeenCalledWith(
      createSwiftCodeDto,
    );
  });

  it('should delete a swift code', async () => {
    mockSwiftCodeRepository.delete.mockResolvedValue({ affected: 1 });
    const result = await service.deleteSwiftCode('TESTCODE123');
    expect(result).toEqual({ message: 'Swift code deleted successfully' });
    expect(mockSwiftCodeRepository.delete).toHaveBeenCalledWith({
      swiftCode: 'TESTCODE123',
    });
  });

  it('should throw an error if no swift code is found to delete', async () => {
    mockSwiftCodeRepository.delete.mockResolvedValue({ affected: 0 });
    await expect(service.deleteSwiftCode('NONEXISTENTCODE')).rejects.toThrow(
      'Swift code not found',
    );
  });

  it('should return swift codes by country', async () => {
    const swiftCodes = [
      { swiftCode: 'US123', countryISO2: 'US' },
      { swiftCode: 'US456', countryISO2: 'US' },
    ];
    mockSwiftCodeRepository.find.mockResolvedValue(swiftCodes);
    const result = await service.getSwiftCodesByCountry('US');
    expect(result.countryISO2).toBe('US');
    expect(result.swiftCodes).toEqual(swiftCodes);
  });

  it('should throw an error if no swift codes are found for a country', async () => {
    mockSwiftCodeRepository.find.mockResolvedValue([]);
    await expect(service.getSwiftCodesByCountry('US')).rejects.toThrow(
      'No swift codes for this country',
    );
  });

  it('should return swift code details', async () => {
    const swiftCodeData = {
      swiftCode: 'SWIFTCODE123',
      countryISO2: 'US',
      bankName: 'Test Bank',
      address: 'Test Address',
      isHeadquarter: true,
    };
    mockSwiftCodeRepository.findOne.mockResolvedValue(swiftCodeData);
    const result = await service.getSwiftCodeDetails('SWIFTCODE123');
    expect(result).toEqual(swiftCodeData);
  });

  it('should throw an error if swift code not found', async () => {
    mockSwiftCodeRepository.findOne.mockResolvedValue(null);
    await expect(
      service.getSwiftCodeDetails('NONEXISTENTCODE'),
    ).rejects.toThrow('Swift code not found');
  });
});
