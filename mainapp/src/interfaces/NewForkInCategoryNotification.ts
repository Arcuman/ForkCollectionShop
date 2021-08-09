import Fork from "../fork/fork.entity";
import User from "../user/user.entity";
import Category from "../category/category.entity";
export interface NewForkInCategoryNotification {
  subscriberFullName: string;
  subscriberEmail: string;
  categoryName: string;
  forkName: string;
}
