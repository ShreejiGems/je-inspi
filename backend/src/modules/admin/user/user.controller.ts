import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ApproveUserDto } from 'src/modules/client/auth/dto/auth.dto';
import { JwtAuthGuard } from 'src/modules/client/auth/guards/jwt.guard';
import { AdminMutationGuard } from 'src/shared/guards/admin-mutation.guard';
import {
  BaseQueryCoreDto,
  CoreIncludesDto,
} from 'src/core/base-query-core/dto/base-query-core.dto';

@Controller('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminMutationGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  @ApiOperation({ summary: 'approved user list' })
  async userList(@Query() baseQueryCoreDto: BaseQueryCoreDto) {
    return await this.userService.userList(baseQueryCoreDto);
  }

  @Get('pending-requests')
  @ApiOperation({ summary: 'approved user list' })
  async pendingRequest(@Query() baseQueryCoreDto: BaseQueryCoreDto) {
    return await this.userService.pendingRequest(baseQueryCoreDto);
  }

  @Get(':userId/details')
  @ApiOperation({ summary: 'Approve user registartion' })
  async userDetails(
    @Query() coreIncludesDto: CoreIncludesDto,
    @Param('userId') userId: string,
  ) {
    return await this.userService.userDetails(coreIncludesDto, userId);
  }

  @Put(':userId/approve')
  @ApiOperation({ summary: 'Approve user registartion' })
  async approveUser(
    @Param('userId') userId: string,
    @Body() approveUserDto: ApproveUserDto,
  ) {
    return await this.userService.approveUser(userId, approveUserDto);
  }

  @Put(':userId/reject')
  @ApiOperation({ summary: 'Approve user registartion' })
  async rejectUser(@Param('userId') userId: string) {
    return await this.userService.rejectUser(userId);
  }

  @Put('send-credential')
  @ApiOperation({ summary: 'send credential to user' })
  @ApiQuery({ name: 'email', required: true })
  @ApiQuery({ name: 'name', required: true })
  @ApiQuery({ name: 'password', required: true })
  async sendCredential(
    @Query('email') email: string,
    @Query('name') name: string,
    @Query('password') password: string,
  ) {
    return await this.userService.sendCredential(email, name, password);
  }

  @Delete(':userId/delete')
  @ApiOperation({ summary: 'delete user' })
  async deleteUser(@Param('userId') userId: string) {
    return await this.userService.deleteUser(userId);
  }
}
