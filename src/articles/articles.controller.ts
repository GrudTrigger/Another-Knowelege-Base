import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { OptionalJwtAuthGuard } from 'src/guard/option-jwt-guard.guard';
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
  create(@Body() dto: CreateArticleDto, @CurrentUser() user: IToken) {
    return this.articlesService.create(dto, user);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    summary:
      'Получение всех статей (если не авторизован - только isPublic: true)',
  })
  @ApiResponse({ status: 200 })
  findAll(@Query() query: GetAllArticlesDto, @CurrentUser() user: IToken) {
    return this.articlesService.findAll(query, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Получение статьи по id' })
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Обновление статьи (только автор)' })
  update(
    @Param('id') id: string,
    @CurrentUser() user,
    @Body() dto: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, dto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Удаление статьи (только автор)' })
  remove(@Param('id') id: string, @CurrentUser() user) {
    return this.articlesService.remove(id, user.userId);
  }
}
