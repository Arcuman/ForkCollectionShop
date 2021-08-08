import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Fork from "../fork/fork.entity";
import CategorySubscription from "../category/subscription/subscription.entity";

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public fullName: string;

  @Column({ unique: true })
  public email: string;

  @Column({ select: false })
  public password: string;

  @Column({
    nullable: true,
    select: false,
  })
  public currentHashedRefreshToken?: string;

  @OneToMany(() => Fork, (fork: Fork) => fork.owner)
  public forks: Fork[];

  @OneToMany(
    () => CategorySubscription,
    (subscription: CategorySubscription) => subscription.subscriber
  )
  public subscriptions: CategorySubscription[];
}

export default User;
