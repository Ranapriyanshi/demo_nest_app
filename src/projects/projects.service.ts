import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from './entities/project.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const { projectName, description, users } = createProjectDto;
    const project = this.projectRepository.create({
      projectName: projectName,
      description,
    });

    if (users && users.length > 0) {
      const userEntities = await this.userRepository.findBy({ id: In(users) });
      project.users = userEntities;
    }

    return await this.projectRepository.save(project);
  }

  async findAll() {
    return await this.projectRepository.find({ relations: ['users'] });
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!project) {
      throw new NotFoundException(`Project with id #${id} not found`);
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOne(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const { users, ...rest } = updateProjectDto;
    Object.assign(project, rest);

    if (users && users.length > 0) {
      const userEntities = await this.userRepository.findBy({ id: In(users) });
      project.users = userEntities;
    }

    return await this.projectRepository.save(project);
  }

  async remove(id: number) {
    const project = await this.findOne(id);
    if (!project) {
      throw new NotFoundException(`Project with id #${id} not found`);
    }
    return await this.projectRepository.remove(project);
  }

  async findUsersByProjectId(projectId: number): Promise<User[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['users'],
    });
    if (!project) {
      throw new NotFoundException(`Project with id #${projectId} not found`);
    }
    return project.users;
  }
}
