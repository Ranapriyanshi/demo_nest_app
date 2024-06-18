import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const city = await this.findOne(id);

    if (!city) {
      throw new NotFoundException(`User #${id} not found`);
    }

    Object.assign(city, updateUserDto);
    return await this.usersRepository.save(city);
  }

  async remove(id: number) {
    const city = await this.findOne(id);

    if (!city) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return await this.usersRepository.remove(city);
  }
}
