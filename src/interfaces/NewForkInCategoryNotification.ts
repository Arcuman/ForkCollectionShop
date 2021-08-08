import Fork from "../fork/fork.entity";
import User from "../user/user.entity";
import Category from "../category/category.entity";

export interface NewForkInCategoryNotification {
  user: User;
  fork: Fork;
  category: Category;
}
