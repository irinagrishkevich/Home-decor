import {Component, Input, OnInit} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged: boolean = false;

  @Input() categories: CategoryType[] = [];

  constructor(private authServices: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) {
    this.isLogged = this.authServices.getIsLoggedIn()
  }

  ngOnInit(): void {
this.authServices.isLogged$.subscribe((isLogged:boolean) => {
  this.isLogged = isLogged;
})

  }

  logout(): void {
    this.authServices.logout()
      .subscribe({
        next: () => {
          this.doLogout()
        },
        error: () => {
         this.doLogout()
        }
      })
  }

  doLogout(){
    this.authServices.removeTokens()
    this.authServices.userId = null

    this._snackBar.open('Вы вышли из системы')
    this.router.navigate(['/'])
  }

}
