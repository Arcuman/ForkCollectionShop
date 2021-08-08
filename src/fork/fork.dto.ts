import {
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";
import ObjectWithIdDto from "../utils/types/objectWithId.dto";

class CreateForkDto {
  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsNumber()
  @IsPositive()
  public creationYear: number;

  @ValidateNested()
  public categories: ObjectWithIdDto[];
}

export default CreateForkDto;
