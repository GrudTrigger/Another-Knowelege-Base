import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class GetAllArticlesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : [value].filter((v) => v !== undefined),
  )
  @ApiPropertyOptional({
    example: ['nestjs'],
    description: 'Теги (можно передавать несколько раз: ?tags=one&tags=two)',
    required: false,
  })
  tags?: string[];
}
