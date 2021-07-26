import { JoinedChannelEntity } from '@/joined_channels.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';
import { LadderUserEntity } from '@/ladder_user.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { BlocksEntity } from '@/blocks.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, default: null, unique: true })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => JoinedChannelEntity, (channel) => channel.user)
  joined_channels: JoinedChannelEntity[];

  @OneToMany(() => LadderUserEntity, (ladder_user) => ladder_user.user)
  ranks: LadderUserEntity[];

  @Column({ nullable: true })
  oauth_id: string;

  @Column({ default: false })
  site_admin: boolean;

  @Column({ type: 'json' })
  avatar_colors: string[];

  @Column({ default: null })
  avatar: string;

  @OneToMany(() => BlocksEntity, (blocks) => blocks.user_id)
  blocks: BlocksEntity[];

  @Column({ nullable: true, type: 'text' })
  twofactor: string;

  // permissions
  isSiteAdmin() {
    return this.site_admin;
  }

  hasTwoFactorEnabled() {
    return this.twofactor !== null;
  }

  isAccountSetup() {
    return this.name && this.name.length > 0;
  }
}

export class UsernameChangeDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export interface INewUser {
  oauth_id: string;
}

export interface IUser {
  oauth_id: string;
  name: string;
  avatar_colors: string[];
}

export class UnrelatedUser {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() avatar_colors: string[];
  @Expose() avatar?: string;
}

export class RelatedUser extends UnrelatedUser {
  @Expose() oauth_id: string;
  @Expose() site_admin: boolean;

  @Expose()
  @Transform(
    ({ obj, value }) =>
      value.constructor === String
        ? value
        : obj.joined_channels
            .filter((v: any) => v.is_joined)
            .map((v: any) =>
              v.channel.constructor === String ? v.channel : v.channel.id,
            ),
    { toClassOnly: true },
  )
  joined_channels: string[] | string;
}

@Exclude()
export class FullDetailsUser extends RelatedUser {
  @Expose()
  @Transform(({ obj }) => obj.joined_channels, { toClassOnly: true })
  joined_channels: any;

  @Expose()
  @Transform(({ value }) => !!value)
  twofactor: any;

  @Expose()
  get twoFactorEnabled() {
    return !!this.twofactor;
  }

  @Expose()
  @Transform(
    ({ obj, value }) =>
      value.constructor === String
        ? value
        : obj.blocks?.map((v: any) =>
            v.constructor === String ? v : v.blocked_user_id,
          ),
    { toClassOnly: true },
  )
  blocks: any;
}
