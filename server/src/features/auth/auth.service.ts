import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: LoginRequestDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase().trim() }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: payload
    };
  }

  async register(dto: RegisterUserDto) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase().trim() }
    });

    if (existing) {
      throw new ConflictException('User already exists with this email');
    }

    const password_hash = await bcrypt.hash(dto.password, 10);
    const newUser = this.userRepository.create({
      email: dto.email.toLowerCase().trim(),
      password_hash,
      full_name: dto.fullName,
      role: dto.role || 'INSPECTOR'
    });

    await this.userRepository.save(newUser);

    const payload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      full_name: newUser.full_name
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: payload
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      created_at: user.created_at
    };
  }
}
