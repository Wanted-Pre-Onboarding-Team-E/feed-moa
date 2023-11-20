import { IsString } from 'class-validator';
import { IsNumber } from 'class-validator/types/decorator/typechecker/IsNumber';

export class CreateHashtagsDto {
  @IsNumber()
  post!: {
    id: number;
  };

  @IsString()
  hashtag!: string;
}
