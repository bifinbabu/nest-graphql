import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { Response } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // Register user
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = registerDto;
    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    const isPhoneNumberExist = await this.prisma.user.findUnique({
      where: {
        phone_number,
      },
    });
    if (isEmailExist) {
      throw new BadRequestException('User already exists with this email');
    }
    if (isPhoneNumberExist) {
      throw new BadRequestException(
        'User already exists with this phone number',
      );
    }
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phone_number,
      },
    });
    console.log('User is', user);
    // return { user, response };
    return user;
  }

  // Login user
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = { email, password };
    return user;
  }

  // Get all user
  async getUsers() {
    // const users = [
    //   { id: '123', name: 'sgdh', email: 'abc@a.com', password: '12345678' },
    // ];
    return await this.prisma.user.findMany({});
  }

  getHello() {
    return 'Hello';
  }
}
