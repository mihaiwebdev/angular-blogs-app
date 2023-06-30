import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category } from '../interfaces/category';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  errorMsg!: string;
  categories: Array<Category> = [];
  formCategory!: string;
  formStatus: string = 'Add';
  categoryId!: string;

  constructor(private categoryService: CategoriesService) {}

  // Load all categories from firestore
  async ngOnInit(): Promise<void> {
    await this.categoryService.loadCategories();
    this.categories = this.categoryService.categories;
  }

  // Add category from the form to firestore
  async handleSubmit(categoryForm: NgForm): Promise<void> {
    if (!categoryForm.value.category) {
      this.errorMsg = 'Please add a category';
      return;
    } else {
      this.errorMsg = '';
    }

    let categoryData: object = {
      category: categoryForm.value.category,
    };

    if (this.formStatus === 'Add') {
      await this.categoryService.saveData(categoryData);
      await this.categoryService.loadCategories();
      this.categories = this.categoryService.categories;
    } else if (this.formStatus === 'Edit') {
      await this.categoryService.updateCategory(this.categoryId, {
        category: this.formCategory,
      });
      await this.categoryService.loadCategories();
      this.categories = this.categoryService.categories;
      this.formStatus = 'Add';
    }

    categoryForm.reset();
  }

  // Edit category in firestore
  editCategory(category: string, categoryId: string): void {
    this.formCategory = category;
    this.formStatus = 'Edit';
    this.categoryId = categoryId;
  }

  // Delete category from firestore
  async deleteCategory(id: string) {
    await this.categoryService.deleteCategory(id);
    await this.categoryService.loadCategories();
    this.categories = this.categoryService.categories;
  }
}
