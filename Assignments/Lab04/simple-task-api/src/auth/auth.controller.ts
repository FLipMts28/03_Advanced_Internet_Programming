import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'testuser' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful', schema: { example: { access_token: 'eyJ...' } } })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @UseGuards(AuthGuard('local'))
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'newuser' },
        password: { type: 'string', example: 'newpass123' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User created', schema: { example: { id: 2, username: 'newuser' } } })
  @ApiResponse({ status: 409, description: 'Username exists' })
  async register(@Body() createUserDto: any) {
    return this.authService.register(createUserDto);
  }
}