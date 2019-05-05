import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
    ) {}

    @Post()
    registerUser(
        @Body()
        userDto: UserDto,
    ) {
        return this.userService.register(userDto);
    }

    @Post('/login')
    loginUser(
        @Body()
        userDto: UserDto,
    ) {
        return this.userService.login(userDto);
    }

    @Get()
    getUsers() {
        return this.userService.getUsers();
    }

    @Get(':id')
    getUser(
        @Param('id')
        id: string,
    ) {
        return this.userService.getUser(id);
    }

    @Delete(':id')
    deleteUser(
        @Param('id')
        id: string,
    ) {
        return this.userService.deleteUser(id);
    }
}
