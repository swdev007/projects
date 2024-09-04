import { ApiProperty } from '@nestjs/swagger';
import { ShoppingCart } from 'src/shopping-cart/entities/shopping-cart.entity';

export class ShoppingCartModel {
  @ApiProperty()
  brand: string;

  @ApiProperty()
  item: string;

  @ApiProperty()
  size: string;

  @ApiProperty()
  datePurchased: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  price: string;

  constructor(data: ShoppingCart) {
    this.id = data.id;
    this.item = data.item;
    this.brand = data.brand;
    this.size = data.size;
    this.datePurchased = data.datePurchased;
    this.category = data.category;
    this.price = data.price;
  }
}
