import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ParseIntPipe } from 'src/common/pipe/parse-int.pipe';


@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: any,
  ) {
    return this.taskService.create(
      createTaskDto,
      req.user.userId,
    );
  }

@UseGuards(JwtAuthGuard)
@Get()
findAll(
  @Req() req: any,
  @Query('page') page: string,
  @Query('limit') limit: string,
  @Query('search') search: string,
  @Query('status') status: string,
  @Query('priority') priority: string,
  @Query('sortBy') sortBy: string,
  @Query('order') order: 'asc' | 'desc' = 'desc',
) {
  return this.taskService.findAll(
    req.user.userId,
    Number(page) || 1,
    Number(limit) || 10,
    search,
    status,
    priority,
    sortBy,
    order,
  );
}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: string,
    @Req() req: any,
  ) {
    return this.taskService.findOne(
      id,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: any,
  ) {
    return this.taskService.update(
      id,
      updateTaskDto,
      req.user.userId,
    );
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.taskService.remove(
      id,
      req.user.userId,
    );
  }
  }

