import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSwiftCodeDto {
  @IsString()
  @IsNotEmpty()
  swiftCode: string;

  @IsString()
  @IsNotEmpty()
  countryISO2: string;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  townName?: string;

  @IsString()
  @IsNotEmpty()
  countryName: string;

  @IsOptional()
  @IsString()
  timeZone?: string;

  @IsBoolean()
  isHeadquarter: boolean;

  @IsString()
  @IsOptional()
  headquarterSwiftCode?: string;
}
