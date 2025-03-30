import { PartialType } from '@nestjs/mapped-types';
import { CreateSwiftCodeDto } from './create-swift-code.dto';

export class UpdateSwiftCodeDto extends PartialType(CreateSwiftCodeDto) {}
