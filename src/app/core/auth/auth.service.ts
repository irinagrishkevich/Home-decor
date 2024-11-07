import { Injectable } from '@angular/core';
import {Observable, Subject, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey = 'accessToken'
  public refreshTokenKey = 'refreshToken'
  public userIdKey = 'userId'


  public isLogged$: Subject<boolean> = new Subject<boolean>()
  private isLogged: boolean = false

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey) // !! приводим к типу boolean
  }




  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email,
      password,
      rememberMe
    })
  }
  signup(email: string, password: string, passwordRepeat: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      email,
      password,
      passwordRepeat
    })
  }
  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens()
    if(tokens && tokens.refreshToken){
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      })
    }

    throw throwError(()=> 'Can not find token')
  }

  getIsLoggedIn(){
    return this.isLogged
  }

  setTokens(accessToken: string, refreshToken: string){
    localStorage.setItem(this.accessTokenKey, accessToken)
    localStorage.setItem(this.refreshTokenKey, refreshToken)
    this.isLogged = true
    this.isLogged$.next(true)
  }

  removeTokens(){
    localStorage.removeItem(this.accessTokenKey)
    localStorage.removeItem(this.refreshTokenKey)
    this.isLogged = false
    this.isLogged$.next(false)
  }

  getTokens(): {accessToken: string | null, refreshToken: string | null}{
    return{
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  }

  get userId(): string | null{
    return localStorage.getItem(this.userIdKey)
  }
  set userId(id: string | null){
    if(id){
      localStorage.setItem(this.userIdKey, id)
    }else{
      localStorage.removeItem(this.userIdKey)
    }
  }
}
