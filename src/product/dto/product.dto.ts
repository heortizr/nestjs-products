import { IsString, IsNumber } from 'class-validator';

export class ProductDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly imageURL: string;

  @IsNumber()
  readonly price: number;

  userId?: string;

  readonly createdAt: Date;
}
