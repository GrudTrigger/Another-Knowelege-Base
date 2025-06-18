import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @ApiProperty({ example: 'securePassword123' })
  password: string;
}
