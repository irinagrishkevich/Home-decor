import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  count: number = 0

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  })

  constructor(private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private authService: AuthService,
              private cartService: CartService,
              private router: Router) { }

  ngOnInit(): void {
  }

  login(){
    if(this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password){
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe) //!!- привести значение к boolean
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null
            if((data as DefaultResponseType).error !== undefined){
              error = (data as DefaultResponseType).message
            }

            const loginResponse = data as LoginResponseType
            if(!loginResponse.accessToken ||
               !loginResponse.refreshToken ||
               !loginResponse.userId){
              error = 'Ошибка при авторизации'
            }
            if(error){
              this._snackBar.open(error)
              throw new Error(error)
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken)
            this.authService.userId = loginResponse.userId

            this._snackBar.open('Авторизация успешна')
            this.router.navigate(['/'])

            // this.cartService.getCartCount()
            //   .subscribe((data: { count: number } | DefaultResponseType) => {
            //     if ((data as DefaultResponseType).error !== undefined) {
            //       console.error((data as DefaultResponseType).message);
            //       return;
            //     }
            //     this.count = (data as { count: number }).count;
            //   });


          },
          error: (errorResponse: HttpErrorResponse) => {
            if(errorResponse.error && errorResponse.error.message){
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open('Ошибка при авторизации')
            }
          }
        })

    }
  }

}
