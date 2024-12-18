import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/default-response.type';
import { FavouriteType } from 'src/types/favourite.type';


@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  constructor(private http: HttpClient) { }

  getFavourites():Observable<FavouriteType[] | DefaultResponseType>{
    return this.http.get<FavouriteType[] | DefaultResponseType>(environment.api + 'favorites')
  }

  removeFavourite(productId: string): Observable<DefaultResponseType>{
    return this.http.delete<DefaultResponseType>(environment.api + 'favorites',{
      body: {productId}
    })
  }
  addFavourite(productId: string): Observable<FavouriteType |DefaultResponseType>{
    return this.http.post<FavouriteType | DefaultResponseType>(environment.api + 'favorites',{productId})
  }
}
