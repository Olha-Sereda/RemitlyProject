import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { SwiftCodeService } from './swift-code.service';
import { CreateSwiftCodeDto } from './dto/create-swift-code.dto';

@Controller('v1/swift-codes')
export class SwiftCodeController {
  constructor(private readonly swiftCodeService: SwiftCodeService) {}

  // Endpoint 1: Get by swift-code
  @Get(':swiftCode')
  getBySwiftCode(@Param('swiftCode') swiftCode: string) {
    return this.swiftCodeService.getSwiftCodeDetails(swiftCode);
  }

  // Endpoint 2: Get all swift-codes by country
  @Get('country/:countryISO2code')
  getByCountry(@Param('countryISO2code') countryISO2: string) {
    return this.swiftCodeService.getSwiftCodesByCountry(countryISO2);
  }

  // Endpoint 3: Create new swift-code
  @Post()
  create(@Body() createSwiftCodeDto: CreateSwiftCodeDto) {
    return this.swiftCodeService.createSwiftCode(createSwiftCodeDto);
  }

  // Endpoint 4: Delete swift-code
  @Delete(':swiftCode')
  delete(@Param('swiftCode') swiftCode: string) {
    return this.swiftCodeService.deleteSwiftCode(swiftCode);
  }
}
