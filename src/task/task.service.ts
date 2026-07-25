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

async findAll(
  userId: string,
  page: number,
  limit: number,
  search?: string,
  status?: string,
  priority?: string,
) {
  const skip = (page - 1) * limit;

  const total = await this.prisma.task.count({
   where: {
    userId,
    ...(status && { status }),
    ...(priority && { priority }),
    ...(search && {
      OR: [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ]
    })
   }
  })

  const totalPages = Math.ceil(total/limit)
  const tasks = await this.prisma.task.findMany({
    where: {
      userId,
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    message: 'Tasks fetched successfully',
    meta: {
      page,
      limit,total,
      totalPages,
    },
    data: tasks,
  };
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
    if (!task) {
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
