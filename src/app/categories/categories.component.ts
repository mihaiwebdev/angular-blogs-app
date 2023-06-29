import { Component } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Category } from '../interfaces/category'
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  errorMsg!: string;

  constructor(private categoryService: CategoriesService) { };

  handleSubmit(categoryForm: NgForm): void{

    if (!categoryForm.value.category) {
      this.errorMsg = 'Please add a category';
      return;

    } else {
      this.errorMsg = '';
    };

    let categoryData: Category = {
      category: categoryForm.value.category
    };

    this.categoryService.saveData(categoryData);
    
  };
}
