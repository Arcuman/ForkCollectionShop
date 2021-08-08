import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Category from "../category/category.entity";
import User from "../user/user.entity";

@Entity()
class Fork {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public creationYear: number;

  @ManyToOne(() => User, (owner: User) => owner.forks)
  public owner: User;

  @ManyToMany(() => Category, (category: Category) => category.forks)
  @JoinTable()
  public categories: Category[];
}

export default Fork;
