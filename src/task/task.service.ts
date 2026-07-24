import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        dueDate: new Date(createTaskDto.dueDate),
        userId,
      },
    });

    return {
      message: 'Task created successfully',
      data: task,
    };
  }

  async findAll(userId: string) {
    return await this.prisma.task.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return {
      message: 'Task fetched successfully',
      data: task,
    };
  }

   async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
      id,
      userId,
    },
    })

    if (!task) {
      throw new NotFoundException('Task not found');
    }

  const updatedTask = await this.prisma.task.update({
  where: {
    id,
    userId,
  },
  data: {
    ...updateTaskDto,
    ...(updateTaskDto.dueDate && {
      dueDate: new Date(updateTaskDto.dueDate),
    }),
  },
});

    return {
      message: 'Task updated successfully',
      data: updatedTask,
    };
  }

 async remove(id: string, userId: string) {
   const task = await this.prisma.task.findFirst({
    where: {
      id,
      userId,
    },
   });
    if(!task) {
      throw new NotFoundException('task not found')
    }

    await this.prisma.task.delete({
      where: {
        id,
      },
    })
    return {
      message: 'Task deleted successfully',
    };
  }
}