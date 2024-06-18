import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './entities/user.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['projects'],
    });
    if (!user) {
      throw new NotFoundException(`User with id #${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return await this.usersRepository.remove(user);
  }

  async addProjectsToUser(userId: number, projectIds: number[]): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id #${userId} not found`);
    }

    const projects = await this.projectRepository.findBy({ id: In(projectIds) });
    if (projects.length !== projectIds.length) {
      throw new NotFoundException(`Some projects with ids [${projectIds}] not found`);
    }

    user.projects = [...user.projects, ...projects];
    return this.usersRepository.save(user);
  }

  async removeProjectFromUser(userId: number, projectId: number): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id #${userId} not found`);
    }

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException(`Project with id #${projectId} not found`);
    }

    user.projects = user.projects.filter(proj => proj.id !== projectId);
    return this.usersRepository.save(user);
  }

  async findUserProjects(userId: number): Promise<Project[]> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id #${userId} not found`);
    }

    return user.projects;
  }
}
