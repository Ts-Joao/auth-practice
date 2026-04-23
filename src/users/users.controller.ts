import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor (private readonly usersService: UsersService) {}

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }

    @Get()
    getUsers() {
        return this.usersService.get()
    }

    @Get(':id')
    getUserById(@Param(ParseUUIDPipe) id: string) {
        return this.usersService.getById(id)
    }

    @Patch(':id')
    updateUser(@Param(ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.patch(id, updateUserDto)
    }

    @Delete(':id')
    deleteUser(@Param(ParseUUIDPipe) id: string) {
        return this.usersService.delete(id)
    }
}
