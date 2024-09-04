export class ShoppingCartModel {
  id: string;
  brand: string;
  datePurchased: string;
  item: string;
  size: string;
  category: string;
  price: string;

  constructor(cartItem: any) {
    this.id = cartItem.id;
    this.brand = cartItem.brand;
    this.datePurchased = cartItem.datePurchased;
    this.item = cartItem.item;
    this.size = cartItem.size;
    this.category = cartItem.category;
    this.price = cartItem.price;
  }
}
