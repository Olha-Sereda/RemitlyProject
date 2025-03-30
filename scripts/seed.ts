import * as fs from 'fs';
import * as csv from 'csv-parser';
import { Injectable } from '@nestjs/common';
import { SwiftCode } from '../src/swift-code/entities/swift-code.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSwiftCodeDto } from '../src/swift-code/dto/create-swift-code.dto';

@Injectable()
export class SwiftCodeService {
  constructor(
    @InjectRepository(SwiftCode)
    private swiftCodeRepository: Repository<SwiftCode>,
  ) {}

  async parseAndInsertCSV(filePath: string): Promise<void> {
    const swiftCodes: SwiftCode[] = [];
    const swiftCodeMap: { [key: string]: SwiftCode } = {}; // Map to hold swiftCodes by swiftCode

    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: { [key: string]: string }) => {
          // Ensure proper handling of the data, avoiding access to undefined properties
          const swiftCode = data['SWIFT CODE'] || '';
          const countryISO2 = data['COUNTRY ISO2 CODE'] || '';
          const bankName = data['NAME'] || '';
          const address = data['ADDRESS'] || '';
          const townName = data['TOWN NAME'] || '';
          const countryName = data['COUNTRY NAME'] || '';
          const timeZone = data['TIME ZONE'] || 'UTC';

          const isHeadquarter = swiftCode.endsWith('XXX');

          const swiftCodeEntity = this.swiftCodeRepository.create({
            swiftCode,
            countryISO2: countryISO2.toUpperCase(),
            bankName,
            address,
            townName,
            countryName: countryName.toUpperCase(),
            timeZone,
            isHeadquarter,
            headquarterSwiftCode: isHeadquarter
              ? undefined
              : swiftCode.substring(0, 8), // Set to undefined instead of null
          });

          // Add the entity to the map
          swiftCodeMap[swiftCode] = swiftCodeEntity;

          // If it's a headquarter, save it directly to the list
          if (isHeadquarter) {
            swiftCodes.push(swiftCodeEntity);
          }
        })
        .on('end', () => {
          // Now handle branches after the stream is finished
          for (const swiftCode of Object.keys(swiftCodeMap)) {
            const swiftCodeEntity = swiftCodeMap[swiftCode];
            if (!swiftCodeEntity.isHeadquarter) {
              // If it's a branch, find its headquarter using the first 8 characters
              const headquarter: SwiftCode | undefined =
                swiftCodeEntity.headquarterSwiftCode
                  ? swiftCodeMap[swiftCodeEntity.headquarterSwiftCode]
                  : undefined; // Ensure headquarterSwiftCode is defined before indexing
              if (headquarter) {
                swiftCodeEntity.headquarter = headquarter;
                swiftCodes.push(swiftCodeEntity); // Push the branch to the list
              }
            }
          }
        });

      // Save all swift codes to the database
      this.swiftCodeRepository
        .save(swiftCodes)
        .then(() => {
          console.log('CSV file successfully processed and saved to DB');
          resolve(); // Resolving the promise
        })
        .catch((error: any) => {
          // Cast error to an instance of Error
          reject(
            new Error(
              `Error saving swift codes: ${(error as Error).message || error}`,
            ),
          );
        });
    });
  }

  // Example of using data in the service for creation
  async createSwiftCode(createSwiftCodeDto: CreateSwiftCodeDto) {
    // Validate properties in DTO
    if (!createSwiftCodeDto.timeZone) {
      createSwiftCodeDto.timeZone = 'UTC';
    }

    if (!createSwiftCodeDto.townName) {
      createSwiftCodeDto.townName = 'Unknown';
    }

    const swiftCodeEntity = this.swiftCodeRepository.create(createSwiftCodeDto);

    try {
      await this.swiftCodeRepository.save(swiftCodeEntity);
    } catch (error) {
      throw new Error('Error saving swift code: ' + (error as Error).message);
    }

    return { message: 'Swift code created successfully' };
  }
}
