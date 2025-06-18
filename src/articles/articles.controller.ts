import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { JwtSoftGuard } from 'src/guard/jwt-soft.guard';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetAllArticlesDto } from './dto/get-all-articles.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Создание статьи' })
  create(@Body() dto: CreateArticleDto, @Req() req) {
    return this.articlesService.create(dto, req.user);
  }

  @UseGuards(JwtSoftGuard)
  @Get()
  @ApiOperation({ summary: 'Получение всех статей' })
  @ApiResponse({ status: 200 })
  findAll(@Query() query: GetAllArticlesDto, @CurrentUser() user?) {
    return this.articlesService.findAll(query, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение статьи по id' })
  findOne(@Param('id') id: string, @CurrentUser() user?) {
    return this.articlesService.findOne(id), user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Обновление статьи (только автор)' })
  update(@Param('id') id: string, @Req() req, @Body() dto: UpdateArticleDto) {
    return this.articlesService.update(id, dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Удаление статьи (только автор)' })
  remove(@Param('id') id: string, @Req() req) {
    return this.articlesService.remove(id, req.user.userId);
  }
}
