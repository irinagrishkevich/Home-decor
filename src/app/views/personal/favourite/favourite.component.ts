import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';
import { FavouriteService } from 'src/app/shared/services/favourite.service';
import { environment } from 'src/environments/environment';
import { CartType } from 'src/types/cart.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { FavouriteType } from 'src/types/favourite.type';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss'],
})
export class FavouriteComponent implements OnInit {
  serverStaticPath = environment.serverStaticPath;
  products: FavouriteType[] = [];

  constructor(
    private favouriteService: FavouriteService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.favouriteService.getFavourites().subscribe((data) => {
      if ((data as DefaultResponseType).error) {
        throw new Error((data as DefaultResponseType).message);
      }

      this.products = (data as FavouriteType[]).map((product) => ({
        ...product,
        cartQuantity: 0,
      }));

      this.syncCartQuantities();
    });
  }


  syncCartQuantities() {
    this.cartService.getCart().subscribe((cartData) => {
      if ((cartData as DefaultResponseType).error) {
        throw new Error((cartData as DefaultResponseType).message);
      }

      const cartItems = (cartData as CartType).items;
      this.products.forEach((product) => {
        const cartItem = cartItems.find(
          (item) => item.product.id === product.id
        );
        if (cartItem) {
          product.cartQuantity = cartItem.quantity;
        }
      });
    });
  }

  addToCart(product: FavouriteType) {
    this.cartService.updateCart(product.id, 1).subscribe(() => {
      product.cartQuantity = 1;
    });
  }
  removeFromCart(product: FavouriteType){
    this.cartService.updateCart(product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        product.cartQuantity = 0;

      })
  }

  updateCartQuantity(product: FavouriteType, quantity: number) {
    this.cartService.updateCart(product.id, quantity).subscribe(() => {
      product.cartQuantity = quantity;
    });
  }

  removeFromFavourites(id: string) {
    this.favouriteService.removeFavourite(id).subscribe(() => {
      this.products = this.products.filter((product) => product.id !== id);
    });
  }


}
