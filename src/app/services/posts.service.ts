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
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  postsCollection: CollectionReference = collection(this.firestore, 'posts');

  constructor(private firestore: Firestore, private toastr: ToastrService) {}

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
  async getPost(id: string): Promise<Post | undefined> {
    let post!: any;

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

    return post;
  }
}
