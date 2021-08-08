import { IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";

class ObjectWithIdDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  id: number;
}

export default ObjectWithIdDto;
