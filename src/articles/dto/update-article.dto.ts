import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateArticleDto {
  @ApiPropertyOptional({ example: 'Обновленное название' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Обновленное содержание', type: 'string' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ example: ['NestJS', 'TypeScript'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    example: false,
    description: 'true = публичная, false = внутренняя',
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
