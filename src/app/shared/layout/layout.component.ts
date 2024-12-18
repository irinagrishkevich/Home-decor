import { Component, OnInit } from '@angular/core';
import { CategoryWithTypeType } from 'src/types/category-with-type.type';
import {CategoryService} from "../services/category.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  categories: CategoryWithTypeType[] = []

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getCategoryWithTypes()
      .subscribe((categories: CategoryWithTypeType[]) => {
        this.categories = categories.map(item => {
          return Object.assign({typesUrl: item.types.map(item => item.url), ...item})
          })
        });
      }

}
