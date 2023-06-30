import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Category } from '../interfaces/category';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  categoryCollection = collection(this.firestore, 'categories');
  categories: Array<Category> = [];

  constructor(private firestore: Firestore, private toastr: ToastrService) {}

  // Add data to the firestore
  async saveData(categoryData: object): Promise<void> {
    try {
      await addDoc(this.categoryCollection, categoryData);
      this.toastr.success('Category added successfully!');
    } catch (error) {
      console.log(error);
    }
  }

  // Get data from the firestore
  async loadCategories(): Promise<void> {
    try {
      const querySnapshot = await getDocs(this.categoryCollection);
      this.categories = [];

      querySnapshot.forEach((doc) => {
        const { category } = doc.data() as Category;
        const id = doc.id;
        this.categories.push({ category, id });
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Update data to firestore
  async updateCategory(id: string, editData: object): Promise<void> {
    const documentRef = doc(this.firestore, 'categories', id);

    try {
      await updateDoc(documentRef, editData);
      this.toastr.success('Category updated successfully!');
    } catch (error) {
      console.error(error);
    }
  }

  // Delete category from firestore
  async deleteCategory(id: string) {
    try {
      if (window.confirm('Are you sure you want to delete?')) {
        await deleteDoc(doc(this.firestore, 'categories', id));
        this.toastr.success('Category deleted');
      }
    } catch (error) {
      console.error(error);
    }
  }
}
