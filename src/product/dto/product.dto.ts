import { IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly imageURL: string;

  @IsNumber()
  readonly price: number;

  readonly createdAt: Date;
}
