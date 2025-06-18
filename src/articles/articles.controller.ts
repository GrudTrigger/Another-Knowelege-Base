import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200 })
  findAll(@Query('tag') tag?: string) {
    if (tag) {
      return this.articlesService.findByTag(tag);
    }
    return this.articlesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by id' })
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create article (auth)' })
  create(@Body() dto: CreateArticleDto, @Req() req) {
    return this.articlesService.create(dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete article (author only)' })
  remove(@Param('id') id: string, @Req() req) {
    return this.articlesService.remove(id, req.user.userId);
  }
}
