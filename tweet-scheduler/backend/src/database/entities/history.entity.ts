import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('history')
export class HistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tweetId: string;

  @Column()
  postedTweetId: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}
