import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Delete,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UsersService } from './users.service.ts';
import { CreateUserDto } from './dto/create-user.dto.ts';
import { UpdateUserDto } from './dto/update-user.dto.ts';
import { UserResponseDto } from './dto/user-response.dto.ts';
import type { RequestWithUser } from '../common/types/request-with-user.ts';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all users (editor/admin only)' })
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  @ApiForbiddenResponse({ description: 'Viewers may not list users' })
  findAll(@Request() req: RequestWithUser) {
    return this.usersService.findAll(req.user.roles);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by id' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'No user exists with that id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update your own user (or any user, as editor/admin)',
  })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'No user exists with that id' })
  @ApiForbiddenResponse({ description: 'You may only update your own user' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ) {
    return this.usersService.update(
      id,
      updateUserDto,
      req.user.id,
      req.user.roles,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete your own user (or any user, as editor/admin)',
  })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'No user exists with that id' })
  @ApiForbiddenResponse({ description: 'You may only delete your own user' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.usersService.remove(id, req.user.id, req.user.roles);
  }
}
