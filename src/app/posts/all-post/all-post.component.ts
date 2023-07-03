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
}
