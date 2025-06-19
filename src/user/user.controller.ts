import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('')
  @ApiOperation({ summary: 'Создание аккаунта' })
  @ApiResponse({ status: 200 })
  async create(@Body() dto: AuthDto) {
    return this.userService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('/:id')
  @ApiOperation({ summary: 'Редактирование аккаунта' })
  @ApiResponse({ status: 200 })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/:id')
  @ApiOperation({ summary: 'Удаление аккаунта' })
  @ApiResponse({ status: 200 })
  async delte(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
