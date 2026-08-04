import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

import { Role } from '@prisma/client';
import { GetUsersDto } from './dto/get-users.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

@Get()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
findAll(@Query() query: GetUsersDto) {
  return this.userService.findAll(query);
}
}