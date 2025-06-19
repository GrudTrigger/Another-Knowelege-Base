import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(data: { email: string; password: string }) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) throw new ConflictException('Email уже занят');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepo.create({
      email: data.email,
      password: hashedPassword,
    });

    return await this.userRepo.save(user);
  }

  async findAll() {
    return this.userRepo.find();
  }

  async findById(id: string) {
    return await this.userRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`Пользователь с id = ${id} не найден`);
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);

    return await this.userRepo.save(user);
  }

  async delete(id: string) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`Пользователь с id = ${id} не найден`);
    }
    await this.userRepo.remove(user);
  }
}
