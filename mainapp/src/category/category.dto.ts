import { IsString } from "class-validator";

class CreateCategoryDto {
  @IsString()
  public name: string;

  @IsString()
  public description: string;
}

export default CreateCategoryDto;
