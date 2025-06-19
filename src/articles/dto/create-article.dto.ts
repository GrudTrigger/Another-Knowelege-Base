import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'Как работать с NestJS' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Полное руководство по NestJS', type: 'string' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: ['NestJS', 'Backend'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    example: true,
    description: 'true = публичная, false = внутренняя',
  })
  @IsBoolean()
  isPublic: boolean;
}
