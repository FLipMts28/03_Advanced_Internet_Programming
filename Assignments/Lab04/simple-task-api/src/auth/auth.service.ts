import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
   import { JwtService } from '@nestjs/jwt';
   import { InjectRepository } from '@nestjs/typeorm';
   import { Repository } from 'typeorm';
   import { User } from '../users/entities/user.entity';
   import * as bcrypt from 'bcryptjs';

   @Injectable()
   export class AuthService {
     constructor(
       @InjectRepository(User)
       private userRepository: Repository<User>,
       private jwtService: JwtService,
     ) {}

     async validateUser(username: string, pass: string): Promise<any> {
       const user = await this.userRepository.findOne({ where: { username } });
       if (user && (await user.validatePassword(pass))) {
         const { password, ...result } = user;
         return result; // { id, username }
       }
       throw new UnauthorizedException();
     }

     async register(createUserDto: { username: string; password: string }) {
       const { username, password } = createUserDto;
       const existingUser = await this.userRepository.findOne({ where: { username } });
       if (existingUser) {
         throw new ConflictException('Username already exists');
       }
       const hashedPassword = await bcrypt.hash(password, 10);
       const user = this.userRepository.create({ username, password: hashedPassword });
       const savedUser = await this.userRepository.save(user);
       const { password: _, ...result } = savedUser;
       return result;
     }

     async login(user: any) {
       const payload = { username: user.username, sub: user.id };
       return {
         access_token: this.jwtService.sign(payload),
       };
     }
   }