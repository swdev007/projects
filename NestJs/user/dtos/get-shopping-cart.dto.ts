import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { ShoppingCartModel } from 'src/models/shopping-cart.model';

export class GetShoppingCart {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page = 1;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Max(50)
  limit = 20;
}

export class GetShoppingCartResponseDto {
  @ApiProperty()
  shoppingCart: ShoppingCartModel[];

  @ApiProperty()
  count: number;
}
