import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { Raw, Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';

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

  async findAll() {
    const article = await this.articleRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['author'],
    });
    return instanceToPlain(article);
  }

  findByTag(tag: string) {
    const article = this.articleRepo.find({
      where: {
        tags: Raw((alias) => `'${tag}' = ANY(${alias})`),
        isPublic: true,
      },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
    instanceToPlain(article);
  }

  async findOne(id: string) {
    const article = await this.articleRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!article) {
      throw new BadRequestException(`Статья с ${id} не найдена`);
    }
    return instanceToPlain(article);
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
