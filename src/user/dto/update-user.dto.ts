import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  password?: string;
}
