import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from '../../interfaces/post';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css'],
})
export class AllPostComponent implements OnInit {
  posts: Post[] = [];

  constructor(private postService: PostsService) {}

  async ngOnInit(): Promise<void> {
    const posts = await this.postService.getPosts();

    this.posts = posts;
  }

  // Delete post
  async deletePost(id: string | undefined): Promise<void> {
    const imgPath = this.posts.find((post) => post.id === id);

    if (window.confirm('Are you sure you want to delete?')) {
      if (id && imgPath) {
        await this.postService.deletePost(id, imgPath.image);
        const posts = await this.postService.getPosts();
        this.posts = posts;
      } else {
        console.log('Post id not found');
      }
    }
  }

  // Update featured status
  async updateFeatured(id: string | undefined): Promise<void> {
    if (id) {
      const post = await this.postService.getPost(id);
      if (post.isFeatured) {
        await this.postService.updatePost(id, { isFeatured: false });
      } else if (!post.isFeatured) {
        await this.postService.updatePost(id, { isFeatured: true });
      }

      const posts = await this.postService.getPosts();
      this.posts = posts;
    } else {
      console.log('post id not found');
    }
  }
}
