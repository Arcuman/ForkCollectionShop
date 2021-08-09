import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from "typeorm";
import User from "../../user/user.entity";
import Category from "../category.entity";

@Entity()
@Unique("subscriber", ["categoryId", "subscriberId"])
class CategorySubscription {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @RelationId(
    (categorySubscription: CategorySubscription) =>
      categorySubscription.subscriber
  )
  public subscriberId: number;

  @ManyToOne(() => User, (subscriber: User) => subscriber.subscriptions)
  public subscriber: User;

  @Column()
  @RelationId(
    (categorySubscription: CategorySubscription) =>
      categorySubscription.category
  )
  public categoryId: number;

  @ManyToOne(() => Category, (category: Category) => category.subscriptions)
  public category: Category;
}

export default CategorySubscription;
