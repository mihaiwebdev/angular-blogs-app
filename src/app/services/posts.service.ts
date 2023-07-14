import { Injectable } from '@angular/core';
import { Post } from '../interfaces/post';
import {
  collection,
  addDoc,
  Firestore,
  CollectionReference,
  getDocs,
  doc,
  getDoc,
  DocumentData,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  postsCollection: CollectionReference = collection(this.firestore, 'posts');

  constructor(
    private firestore: Firestore,
    private toastr: ToastrService,
    private storageService: StorageService
  ) {}

  // Create post in database
  async createPost(postData: Post): Promise<void> {
    try {
      await addDoc(this.postsCollection, postData);

      this.toastr.success('Post succesfully created!');
    } catch (error) {
      console.error(error);
    }
  }

  // Get all posts from database
  async getPosts(): Promise<Post[]> {
    let posts: Post[] = [];

    try {
      const querySnapshot = await getDocs(this.postsCollection);

      querySnapshot.forEach((doc) => {
        const data: Post = doc.data() as Post;
        data.id = doc.id;

        posts.push(data);
      });
    } catch (error) {
      console.error(error);
    }
    return posts;
  }

  // Get single post from database
  async getPost(id: string): Promise<Post> {
    let post!: DocumentData;

    try {
      const docRef = doc(this.firestore, 'posts', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        post = docSnap.data();
      } else {
        this.toastr.error('Post not found');
      }
    } catch (error) {
      console.error(error);
    }

    return post as Post;
  }

  // Update post in database
  async updatePost(id: string, data: object): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'posts', id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(error);
    }
  }

  // Delete post from database
  async deletePost(id: string, imgPath: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'posts', id);
      await this.storageService.deleteImage(imgPath);
      await deleteDoc(docRef);
      this.toastr.warning('Data deleted');
    } catch (error) {
      console.error(error);
    }
  }
}
