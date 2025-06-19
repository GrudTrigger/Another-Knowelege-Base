import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './articles/article.entity';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      entities: [User, Article],
      synchronize: true,
      host: 'postgres',
    }),
    UserModule,
    AuthModule,
    ArticlesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
