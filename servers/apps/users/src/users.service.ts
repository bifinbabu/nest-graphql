import { Injectable } from '@nestjs/common';
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
  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;
    const user = { name, email, password };
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
