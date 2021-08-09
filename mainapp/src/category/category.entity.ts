import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Fork from "../fork/fork.entity";
import CategorySubscription from "./subscription/subscription.entity";

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @ManyToMany(() => Fork, (fork: Fork) => fork.categories)
  public forks: Fork[];

  @OneToMany(
    () => CategorySubscription,
    (subscription: CategorySubscription) => subscription.category
  )
  public subscriptions: CategorySubscription[];
}

export default Category;
