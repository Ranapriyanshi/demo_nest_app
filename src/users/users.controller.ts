import { Controller, Param, ParseIntPipe, Post, Body, Get, Delete, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddProjectsToUserDto } from './dto/add-projects-to-user.dto';
import { Project } from 'src/projects/entities/project.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  // Adding projects to a user
  @Post(':id/projects')
  async addProjectsToUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() addProjectsToUserDto: AddProjectsToUserDto,
  ): Promise<Project[]> {
    const { projects } = addProjectsToUserDto;
    const user = await this.usersService.addProjectsToUser(userId, projects);
    return user.projects;
  }

  // Removing a project from a user
  @Delete(':userId/projects/:projectId')
  async removeProjectFromUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<Project[]> {
    const user = await this.usersService.removeProjectFromUser(userId, projectId);
    return user.projects;
  }

  // Finding a user's projects
  @Get(':id/projects')
  async findUserProjects(@Param('id', ParseIntPipe) userId: number): Promise<Project[]> {
    return this.usersService.findUserProjects(userId);
  }
}
