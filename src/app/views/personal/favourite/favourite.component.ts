import { Component, OnInit } from '@angular/core';
import { FavouriteService } from 'src/app/shared/services/favourite.service';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/default-response.type';
import { FavouriteType } from 'src/types/favourite.type';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss']
})
export class FavouriteComponent implements OnInit {

  serverStaticPath = environment.serverStaticPath
  products: FavouriteType[] = []
  constructor(private favouriteService: FavouriteService) { }

  ngOnInit(): void {
    this.favouriteService.getFavourites()
      .subscribe((data: FavouriteType[] | DefaultResponseType) => {
        if((data as DefaultResponseType).error !== undefined){
          const error = (data as DefaultResponseType).message
          throw new Error(error)
        }

        this.products = (data as FavouriteType[])
      })
  }

  removeFromFavourites(id: string){
    this.favouriteService.removeFavourite(id)
      .subscribe((data: DefaultResponseType) =>{
        if (data.error){
          throw new Error(data.message)
        }

        this.products = this.products.filter(item => item.id !== id)
      })
  }



}
