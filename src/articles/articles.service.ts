import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetAllArticlesDto } from './dto/get-all-articles.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
  ) {}

  create(dto: CreateArticleDto, user: IToken) {
    const article = this.articleRepo.create({ ...dto, authorId: user.userId });
    return this.articleRepo.save(article);
  }

  async findAll(query: GetAllArticlesDto, user?: IToken) {
    const tags = query.tags?.map((tag) => tag.toLowerCase()) || [];

    const qb = this.articleRepo
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.author', 'author');

    if (!user) {
      qb.andWhere('article.isPublic = :isPublic', { isPublic: true });
    }

    if (tags.length) {
      qb.andWhere('article.tags && :tags', { tags });
    }

    try {
      return await qb.orderBy('article.createdAt', 'DESC').getMany();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    const qb = this.articleRepo
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.author', 'author')
      .where('article.id = :id', { id });

    const article = await qb.getOne();

    if (!article) {
      throw new BadRequestException(
        `Статья с id ${id} не найдена или недоступна`,
      );
    }

    return article;
  }

  async update(
    articleId: string,
    updateData: UpdateArticleDto,
    currentUser: IToken,
  ) {
    const article = await this.articleRepo.findOne({
      where: { id: articleId },
      relations: ['author'],
    });

    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }

    if (article.author.id !== currentUser.userId) {
      throw new ForbiddenException('Вы не являетесь автором этой статьи');
    }

    const updatedArticle = this.articleRepo.merge(article, updateData);

    try {
      return await this.articleRepo.save(updatedArticle);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string, userId: string) {
    const article = await this.articleRepo.findOne({ where: { id } });
    if (!article) {
      throw new BadRequestException('Статья не найдена');
    }
    if (article.author.id !== userId)
      throw new BadRequestException('Вы не являетесь автором статьи');
    try {
      return this.articleRepo.delete(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
