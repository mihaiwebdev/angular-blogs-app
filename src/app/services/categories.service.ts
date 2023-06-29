import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore'
import { Category } from '../interfaces/category'
import { ToastrModule } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private afs: Firestore) { }

  async saveData(categoryData: Category): Promise<void> {
    const categoryCollection = collection(this.afs, 'categories');

    try {
      await addDoc(categoryCollection, categoryData);
      console.log('Category added successfully!');

    } catch (error) {
      console.log(error);
    };

  }
}
