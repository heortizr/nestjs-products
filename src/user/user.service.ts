import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interface/user.interface';
import { UserDto } from './dto/user.dto';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './dto/user.ro';

@Injectable()
export class UserService {

    constructor(
        @InjectModel('user')
        private readonly userModel: Model<User>,
    ) {}

    async register(
        userDto: UserDto,
    ): Promise<User> {
        const { username } = userDto;
        const user = await this.userModel.findOne({ username });
        if (user) {
            throw new BadRequestException('User already exists');
        }

        userDto.password = await this.hashPassword(userDto.password);
        const newUser = new this.userModel(userDto);
        return await newUser.save();
    }

    async login(
        userDto: UserDto,
    ) {
        const { username, password } = userDto;

        const user = await this.userModel.findOne({ username });
        if (!user || !await bcrypt.compare(password, user.password)) {
            throw new BadRequestException('Invalid username/password');
        }

        const userRO = new UserRO();
        userRO.id = user.id;
        userRO.username = user.username;
        userRO.token = await this.token(user.id, user.username);
        Logger.debug(userRO);
        return userRO;
    }

    async getUsers(): Promise<User[]> {
        return await this.userModel.find();
    }

    async getUser(id: string): Promise<User> {
        return await this.userModel.findById(id);
    }

    async deleteUser(id: string): Promise<User> {
        return await this.userModel.findOneAndDelete(id);
    }

    async updateUser(
        id: string,
        userDto: UserDto,
    ): Promise<User> {
        return await this.userModel.findOneAndUpdate(
            id,
            userDto,
            { new: true },
        );
    }

    private async hashPassword(password: string) {
        return await bcrypt.hash(password, 10);
    }

    private token(id: string, username: string) {
        return jwt.sign(
            { id, username },
            process.env.SECRET,
            { expiresIn: '180d' },
        );
    }
}
