import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '~/middleware/guards/auth.guards';
import { User } from '~/middleware/decorators/login.decorator';
import { UserEntity } from '@/user.entity';
import { UserService } from '$/users/user.service';
import { FriendsService } from './friends.service';
import { FriendsEntity } from '@/friends.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('friends')
@UseGuards(AuthenticatedGuard)
export class FriendsController {
  constructor(
    private friendsService: FriendsService,
    private userService: UserService,
  ) {}

  // Send friend request
  @Post('add/:friend_id')
  async friendRequest(
    @Param('friend_id') friendId: string,
    @User() user: UserEntity,
  ): Promise<UpdateResult> {
    // checking if friend is in general user table
    const friend = await this.userService.findUser(friendId);
    if (!friend) throw new NotFoundException();

    // checking if friend is the logged in user
    if (user.id === friend.id) throw new BadRequestException();

    return this.friendsService.sendFriendRequest(
      user.id,
      friend.id,
      user.id,
      friend.id,
    );
  }

  // Find all pending friend requests
  @Get('requests')
  findRequests(@User() user: UserEntity): Promise<FriendsEntity[]> {
    return this.friendsService.findAllFriendRequests(user.id);
  }

  // Accept pending friend request
  @Patch('accept/:friendrequest_id')
  async acceptRequest(
    @Param('friendrequest_id') friendRequestId: string,
    @User() user: UserEntity,
  ): Promise<UpdateResult> {
    return this.friendsService.acceptFriendRequest(user.id, friendRequestId);
  }

  // Unfriend existing friend
  @Delete('unfriend/:friendrequest_id')
  async unfriend(
    @Param('friendrequest_id') friendRequestId: string,
    @User() user: UserEntity,
  ): Promise<DeleteResult> {
    return this.friendsService.deleteFriendship(user.id, friendRequestId);
  }

  // Get full friendlist
  @Get('friendlist')
  async getFriendlist(@User() user: UserEntity): Promise<UserEntity[]> {
    return this.friendsService.getFriendList(user.id);
  }
}
