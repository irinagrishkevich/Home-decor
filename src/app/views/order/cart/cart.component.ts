import { Component, OnInit } from '@angular/core';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { environment } from 'src/environments/environment';
import { CartType } from 'src/types/cart.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { ProductType } from 'src/types/product.type';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  serverStaticPath = environment.serverStaticPath

  extraProducts: ProductType[] = []

  constructor(private productService: ProductService,
              private cartService: CartService,
             ) { }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }

  cart: CartType | null = null
  totalAmount: number = 0
  totalCount: number = 0


  ngOnInit(): void {
    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.extraProducts = data
      })

    this.cartService.getCart()
      .subscribe((data: CartType |  DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        this.cart = data as CartType

        this.calculateTotal()
      })
  }

  calculateTotal(){
    this.totalCount = 0
    this.totalAmount = 0
    if(this.cart){
      // this.totalCount = this.cart.items.reduce((acc, item) => acc + item.quantity, 0)
      // this.totalAmount = this.cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

      this.cart.items.forEach(item => {
        this.totalAmount += item.product.price * item.quantity
        this.totalCount += item.quantity
      })
    }
  }

updateCount(id: string, value: number){
    if(this.cart){
      this.cartService.updateCart(id, value)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message)
          }
          this.cart = data as CartType
          this.calculateTotal()
        })
    }

}



}
