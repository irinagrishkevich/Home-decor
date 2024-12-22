import {Component, HostListener, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CategoryWithTypeType} from 'src/types/category-with-type.type';
import {CartService} from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { ProductType } from 'src/types/product.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  searchField = new FormControl('')
  showedSearch: boolean = false
  serverStaticPath = environment.serverStaticPath
  products: ProductType[] = []
  count: number = 0
  isLogged: boolean = false;

  @Input() categories: CategoryWithTypeType[] = [];

  constructor(private authServices: AuthService,
              private _snackBar: MatSnackBar,
              private cartService: CartService,
              private productService: ProductService,
              private router: Router) {
    this.isLogged = this.authServices.getIsLoggedIn()
  }

  ngOnInit(): void {
    this.searchField.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(value => {
        if(value && value.length > 1){
          this.productService.searchProducts(value)
            .subscribe((data:ProductType[]) => {
              this.products = data
              this.showedSearch = true
            })
        } else {
          this.products = []
        }
      })

    this.updateCartCount()
    this.authServices.isLogged$.subscribe((isLogged: boolean) => {
      this.isLogged = isLogged;


      if (this.isLogged) {

        this.updateCartCount();
      } else {
        this.clearCart();
      }
    })






  }
  updateCartCount(): void {
    this.cartService.getCartCount()
      .subscribe((data: { count: number } | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          console.error((data as DefaultResponseType).message);
          return;
        }
        this.count = (data as { count: number }).count;

        this.cartService.count$.subscribe((count: number) => {
          this.count = count
        })
      });

  }
  clearCart(): void {
    this.cartService.clearCartCount();
    this.count = 0;
  }

  logout(): void {
    this.authServices.logout()
      .subscribe({
        next: () => {
          this.clearCart()
          this.doLogout()
        },
        error: () => {
          this.clearCart()
          this.doLogout()
        }
      })
  }

  doLogout() {
    this.authServices.removeTokens()
    this.authServices.userId = null

    this._snackBar.open('Вы вышли из системы')
    this.router.navigate(['/'])
  }

  // changeSearchValue(newValue: string){
  //   this.searchValue = newValue
  //
  //   if(this.searchValue && this.searchValue.length > 2){
  //     this.productService.searchProducts(this.searchValue)
  //       .subscribe((data:ProductType[]) => {
  //         this.products = data
  //       })
  //   } else {
  //     this.products = []
  //   }
  // }


  selectProduct(url: string){
    this.router.navigate(['/product/' + url])
    this.searchField.setValue('')
    this.products = []
  }

  // changeShowedSearch(showed: boolean){
  //   setTimeout(() => {
  //     this.showedSearch = showed
  //   }, 100)
  // }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.showedSearch && (event.target as HTMLElement).className.indexOf('search-products') === -1) {
      this.showedSearch = false
    }
  }
}
