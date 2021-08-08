import { ValidateNested } from "class-validator";
import ObjectWithIdDto from "../../utils/types/objectWithId.dto";

class CategorySubscriptionDto {
  @ValidateNested()
  public category: ObjectWithIdDto;
}

export default CategorySubscriptionDto;
