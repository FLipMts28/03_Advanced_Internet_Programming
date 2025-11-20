   import { Injectable, OnModuleInit } from '@nestjs/common';
   import { InjectRepository } from '@nestjs/typeorm';
   import { Repository } from 'typeorm';
   import { User } from './entities/user.entity';
   import * as bcrypt from 'bcryptjs';

   @Injectable()
   export class UserSeederService implements OnModuleInit {
     constructor(
       @InjectRepository(User)
       private userRepository: Repository<User>,
     ) {}

     async onModuleInit() {
       const count = await this.userRepository.count();
       if (count === 0) {
         const hashedPassword = await bcrypt.hash('password123', 10);
         const user = this.userRepository.create({
           username: 'testuser',
           password: hashedPassword,
         });
         await this.userRepository.save(user);
         console.log('User seeded: testuser / password123');
       }
     }
   }