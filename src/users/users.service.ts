import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(createUserDto: CreateUserDto) {
        try {
            const findEmail = await this.databaseService.user.findUnique({
                where: { email: createUserDto.email }
            })
    
            if(findEmail) {
                throw new HttpException('Email already exists',HttpStatus.CONFLICT)
            }

            const hashedPassword = await bcrypt.hash(createUserDto.password, 10) 
    
            const newUser = await this.databaseService.user.create({
                data: {
                    email: createUserDto.email,
                    password: hashedPassword
                }
            })

            return newUser
        } catch (error) {
            throw new HttpException('Database Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findByEmail(email: string) {
        return this.databaseService.user.findUnique({ where: { email } })
    }

    async get() {
        try {
            const findUsers = await this.databaseService.user.findMany()

            if (!findUsers) {
                throw new NotFoundException('Users not found!')
            }

            return findUsers
        } catch (error) {
            throw new HttpException(
                'Error getting users!',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getById(id: string) {
        try {
            const findUser = await this.databaseService.user.findUnique({
                where: { id }
            })

            if (!findUser) {
                throw new NotFoundException('User not found!')
            }

            return findUser
        } catch (error) {
            throw new HttpException(
                'Error finding user',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async patch(id: string, updateUserDto: UpdateUserDto) {
        try {
            const findUser = await this.databaseService.user.findUnique({
                where: { id }
            })

            if (!findUser) {
                throw new NotFoundException('User not found!')
            }

            const updateUser = await this.databaseService.user.update({
                where: { id },
                data: updateUserDto
            })

            return updateUser
        } catch (error) {
            throw new HttpException(
                'Error finding user',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async delete(id: string) {
        try {
            const findUser = await this.databaseService.user.findUnique({
                where: { id }
            })
    
            if (!findUser) {
                throw new NotFoundException('User not found!')
            }

            const deleteUser = await this.databaseService.user.delete({
                where: { id }
            })

            return deleteUser
        } catch (error) {
            throw new HttpException(
                'Error finding user',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async updateRefreshToken(userId: string, hash: string) {
        return this.databaseService.user.update({
            where: { id: userId },
            data: { refreshToken: hash }
        })
    }

}
