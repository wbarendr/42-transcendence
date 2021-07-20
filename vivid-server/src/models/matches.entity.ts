import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { WarEntity } from './war.entity';

@Entity({ name: 'matches' })
export class MatchesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.matches_req)
  @JoinColumn({ name: 'user_req' })
  user_req: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.matches_acpt)
  @JoinColumn({ name: 'user_acpt' })
  user_acpt: UserEntity;

  @CreateDateColumn()
  game_ended: Date;

  @Column()
  points_req: number;

  @Column()
  points_acpt: number;

  @Column('varchar', { default: null })
  add_ons: string;

  @Column()
  game_type: string;

  @Column()
  winner_id: string;

  @ManyToOne(() => WarEntity, (war) => war.id)
  @JoinColumn({ name: 'war_id' })
  war_id: WarEntity;
}
