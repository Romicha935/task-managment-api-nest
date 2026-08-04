import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetUsersDto } from './dto/get-users.dto';


@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

   async findAll(query: GetUsersDto) {
      console.log("Query:", query);
        const {page, limit, search, role, sortBy, sortOrder} = query;
        const skip = (page - 1) * limit;

        const where = {} as any;
        if (search) {
            where.OR = [
                {
                    firstName: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    lastName: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    email: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            ];
        }
        if (role) {
            where.role = role;
        }
       
      


const total = await this.prisma.user.count({
    where, 
})

const users = await this.prisma.user.findMany({
    where,
    skip,
    take: limit,
  orderBy: {
   [sortBy]: sortOrder
},
    select:{
        id:true,
        firstName:true,
        lastName:true,
        email:true,
        role:true,
        createdAt:true,
        updatedAt:true
    }
});
return {
    data: users,
    meta: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPreviousPage: page > 1,
    }
};
    }
 
    }