import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (existingUser) {
      return {
        message: 'Email already exists',
      };
    }

    const hashedpassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        email: registerDto.email,
        password: hashedpassword,
      },
    });
    return {
      message: `User registred successfully`,
      data: user,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      return {
        message: 'Invalid credentials',
      };
    }

    const isPasswordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatched) {
      return {
        message: 'invalid credentials',
      };
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload,{expiresIn: '15m',});

    const refreshToken = await this.jwtService.signAsync(payload,{expiresIn:'7d',})

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });

    return {
      message: 'Login successfull',
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const {refreshToken} = refreshTokenDto;
    const payload = await this.jwtService.verifyAsync(refreshToken)

    const user = await this.prisma.user.findUnique({
      where: {
        id:payload.sub,
      },
   })
      if (!user) {
        return {
          message: 'User Not Found',
        }
      }

      if (!user.refreshToken) {
  return {
    message: 'Refresh token expired',
  };
}

  const isRefreshTokenMatched = await bcrypt.compare(
  refreshToken,
  user.refreshToken!,
);

      if (!isRefreshTokenMatched)
        return {
          message: 'Invalid refresh token',
        }
      

        const newPayload = {
          sub: user.id,
          email: user.email
        }
  const accessToken = await this.jwtService.signAsync(newPayload, {expiresIn: '15m',});

  return {
    message: 'Access token refreshed successfully',
    accessToken,
  }
  };

  async profile(userId:string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id:userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'User profile fetched successfully',
      data: user,
    };
  };

  async logout(userId:string) {
    await this.prisma.user.update({
      where: {
        id:userId,
      },
      data: {
        refreshToken: null,
      },
    });

    return {
      message: 'User logged out successfully',
    };
  }
}
