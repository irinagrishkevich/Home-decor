import {Component, Input, OnInit} from '@angular/core';
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import { CartService } from '../../services/cart.service';
import { CartType } from 'src/types/cart.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FavouriteService } from '../../services/favourite.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { FavouriteType } from 'src/types/favourite.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { Router } from '@angular/router';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product!:ProductType
  serverStaticPath = environment.serverStaticPath
  count: number = 1
  @Input() isLight: boolean = false
  @Input() countInCart: number | undefined = 0

  isLogged: boolean = false;
  // isInCart: boolean = false



  constructor(private cartService: CartService,
              private favouriteService: FavouriteService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private authService: AuthService) {
    this.isLogged = this.authService.getIsLoggedIn()
  }

  ngOnInit(): void {
    if(this.countInCart && this.countInCart > 1){
      this.count = this.countInCart
    }
    this.authService.isLogged$.subscribe((isLogged: boolean) => {
      this.isLogged = isLogged;
    })


  }

  addToCart(){
  this.cartService.updateCart(this.product.id, this.count)
    .subscribe((data: CartType | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message)
      }
      // this.isInCart = true
      this.countInCart = this.count
    })
  }


  updateCount(value: number){
    this.count = value
    // if(this.isInCart){
    //   this.cartService.updateCart(this.product.id, value)
    //     .subscribe((data: CartType) => {
    //       this.isInCart = true
    //
    //     })
    // }

    if(this.countInCart){
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message)
          }
          this.countInCart = this.count
        })
    }

  }
  removeFromCart(){
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        // this.isInCart = false
        this.countInCart = 0
        this.count = 1

      })
  }

  updateFavourite() {
    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open('Вы должны авторизоваться для добавления в избранное')
      return
    }
    if(this.product.IsInFavourite){
      this.favouriteService.removeFavourite(this.product.id)
        .subscribe((data: DefaultResponseType) => {
          if(data.error){
            throw new Error(data.message)
          }
          this.product.IsInFavourite = false
        })
    } else {
      this.favouriteService.addFavourite(this.product.id)
        .subscribe((data: FavouriteType | DefaultResponseType) => {
          if((data as DefaultResponseType).error !== undefined){
            throw new Error((data as DefaultResponseType).message)
          }
          this.product.IsInFavourite = true
        })
    }


  }

  navigate(){
    if(this.isLight){
      this.router.navigate(['/product/' + this.product.url])
    }
  }

}
