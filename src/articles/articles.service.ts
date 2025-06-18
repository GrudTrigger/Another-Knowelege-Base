import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
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
    console.log(user);
    const article = this.articleRepo.create({ ...dto, authorId: user.userId });
    return this.articleRepo.save(article);
  }

  async findAll(query: GetAllArticlesDto, user?) {
    console.log(user);

    const { tags } = query;

    const qb = this.articleRepo
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author');

    if (!user) {
      qb.andWhere('article.isPublic = :isPublic', { isPublic: true });
    }

    if (tags && tags.length) {
      const lowerCaseTags = tags.map((tag) => tag.toLowerCase());

      qb.andWhere(
        `EXISTS (
          SELECT 1 FROM unnest(article.tags) AS tag
          WHERE LOWER(tag) = ANY(:tags)
        )`,
        { tags: lowerCaseTags },
      );
    }

    const articles = await qb.orderBy('article.createdAt', 'DESC').getMany();
    return instanceToPlain(articles);
  }

  async findOne(id: string, user?) {
    const qb = this.articleRepo
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.id = :id', { id });

    if (!user) {
      qb.andWhere('article.isPublic = :isPublic', { isPublic: true });
    }

    const article = await qb.getOne();

    if (!article) {
      throw new BadRequestException(
        `Статья с id ${id} не найдена или недоступна`,
      );
    }

    return instanceToPlain(article);
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

    return instanceToPlain(await this.articleRepo.save(updatedArticle));
  }

  async remove(id: string, userId: string) {
    const article = await this.articleRepo.findOne({ where: { id } });
    if (!article) {
      throw new BadRequestException('Article not found');
    }
    if (article.author.id !== userId) throw new Error('Forbidden');
    return this.articleRepo.delete(id);
  }
}
