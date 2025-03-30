import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSwiftCodeDto } from './dto/create-swift-code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { SwiftCode } from './entities/swift-code.entity';
import { SwiftCSVData } from './types/swift-csv-data.type';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { console } from 'inspector';

@Injectable()
export class SwiftCodeService {
  constructor(
    @InjectRepository(SwiftCode)
    private swiftCodeRepository: Repository<SwiftCode>,
  ) {}

  async parseAndInsertCSV(filePath: string): Promise<void> {
    const swiftCodes: SwiftCode[] = [];

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: SwiftCSVData) => {
          swiftCodes.push(
            this.swiftCodeRepository.create({
              swiftCode: data['SWIFT CODE'],
              countryISO2: data['COUNTRY ISO2 CODE'],
              bankName: data['NAME'],
              address: data['ADDRESS'],
              townName: data['TOWN NAME'],
              countryName: data['COUNTRY NAME'],
              timeZone: data['TIME ZONE'],
              isHeadquarter: data['SWIFT CODE'].endsWith('XXX'),
            }),
          );
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    await this.swiftCodeRepository.save(swiftCodes);
    console.log('CSV file successfully processed and saved to DB');
  }

  async createSwiftCode(createSwiftCodeDto: CreateSwiftCodeDto) {
    if (!createSwiftCodeDto.timeZone) {
      createSwiftCodeDto.timeZone = 'UTC'; // Set a default if no timeZone is provided
    }

    if (!createSwiftCodeDto.townName) {
      createSwiftCodeDto.townName = 'Unknown'; // Set a default if no townName is provided
    }

    const swiftCodeEntity = this.swiftCodeRepository.create(createSwiftCodeDto);

    // If it's a branch, associate it with the headquarter using the headquarterSwiftCode
    if (!swiftCodeEntity.isHeadquarter) {
      const headquarter = await this.swiftCodeRepository.findOne({
        where: { swiftCode: createSwiftCodeDto.headquarterSwiftCode },
      });

      if (headquarter) {
        swiftCodeEntity.headquarter = headquarter; // Associate the branch with its headquarter
      } else {
        throw new NotFoundException('Headquarter not found');
      }
    }

    await this.swiftCodeRepository.save(swiftCodeEntity);

    return { message: 'Swift code created successfully' };
  }

  async findAll(): Promise<SwiftCode[]> {
    return this.swiftCodeRepository.find();
  }

  // Find one swift code by id
  async findOne(id: string): Promise<SwiftCode> {
    const swiftCode = await this.swiftCodeRepository.findOne({
      where: { swiftCode: id },
    });

    if (!swiftCode) {
      throw new NotFoundException(`Swift code with id ${id} not found`);
    }

    return swiftCode;
  }

  async getSwiftCodesByCountry(countryISO2: string) {
    const swiftCodes = await this.swiftCodeRepository.find({
      where: { countryISO2 },
    });

    if (!swiftCodes.length)
      throw new NotFoundException('No swift codes for this country');

    return {
      countryISO2,
      countryName: swiftCodes[0].countryName,
      swiftCodes,
    };
  }

  async getSwiftCodeDetails(swiftCode: string) {
    const headquarter = await this.swiftCodeRepository.findOne({
      where: {
        swiftCode: swiftCode,
        isHeadquarter: true,
      },
      select: [
        'address',
        'bankName',
        'countryISO2',
        'isHeadquarter',
        'swiftCode',
        'countryName',
      ],
    });

    if (!headquarter) {
      throw new NotFoundException('Swift code not found');
    }

    const branchOffices = await this.swiftCodeRepository.find({
      where: {
        swiftCode: Like(`${swiftCode.slice(0, -3)}%`),
        isHeadquarter: false,
      },
      select: [
        'address',
        'bankName',
        'countryISO2',
        'isHeadquarter',
        'swiftCode',
      ],
    });

    return { headquarter, branches: branchOffices };
  }

  async deleteSwiftCode(swiftCode: string) {
    const result = await this.swiftCodeRepository.delete({ swiftCode });
    if (result.affected === 0)
      throw new NotFoundException('Swift code not found');

    return { message: 'Swift code deleted successfully' };
  }
}
