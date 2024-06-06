import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { Response } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: number;
}
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: 'sdv',
      role: 'df',
      createdAt: new Date(),
      updatedAt: new Date(),
      name,
      email,
      password: hashedPassword,
      phone_number,
    };

    const activationToken = await this.createActivationToken(user);
    const activationCode = activationToken.activationCode;
    console.log('activationCode is', activationCode);
    // return { user, response };
    return user;
  }

  // Create activation token
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m',
      },
    );
    return { token, activationCode };
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
