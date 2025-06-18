import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({ example: 'Как работать с NestJS' })
  title: string;

  @ApiProperty({ example: 'Полное руководство по NestJS', type: 'string' })
  content: string;

  @ApiProperty({ example: ['NestJS', 'Backend'], type: [String] })
  tags: string[];

  @ApiProperty({
    example: true,
    description: 'true = публичная, false = внутренняя',
  })
  isPublic: boolean;
}
