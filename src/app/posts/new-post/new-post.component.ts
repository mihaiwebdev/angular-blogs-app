import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/interfaces/category';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../interfaces/post';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  imageSrc: string | ArrayBuffer = './assets/image-placeholder.jpg';
  categories!: Category[];
  postForm!: FormGroup;
  permalinkControl!: FormControl;
  selectedImage!: string;

  constructor(
    private categoryService: CategoriesService,
    private formBuilder: FormBuilder,
    private postService: PostsService,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get query params
    this.route.queryParams.subscribe(async (q) => {
      let post!: Post;

      if (q['id']) {
        const postData = await this.postService.getPost(q['id']);
        if (postData) {
          post = postData;
          this.imageSrc = postData.image;
          this.selectedImage = postData.image;
        } else {
          console.log('Post data is undefined');
        }
      }

      // Create and validate form
      this.postForm = this.formBuilder.group({
        title: [
          post?.title || '',
          [Validators.required, Validators.minLength(10)],
        ],
        permalink: [
          { value: post?.permalink || '', disabled: true },
          Validators.required,
        ],
        excerpt: [
          post?.excerpt || '',
          [Validators.required, Validators.minLength(10)],
        ],
        category: [
          post?.category ? `${post.category.name}-${post.category.id}` : '',
          Validators.required,
        ],
        image: [''],
        content: [post?.content || '', Validators.required],
      });
      this.permalinkControl = this.postForm.get('permalink') as FormControl;
    });
  }

  async ngOnInit(): Promise<void> {
    // Fetch all categories
    await this.categoryService.loadCategories();
    this.categories = this.categoryService.categories;
  }

  get formControl() {
    return this.postForm.controls;
  }

  // Creatte title slug
  onTitleChange($event: KeyboardEvent): void {
    const target = $event.target as HTMLInputElement;
    this.permalinkControl.patchValue(target?.value.replace(/\s/g, '-'));
  }

  // Upload and preview image
  async selectImage($event: Event): Promise<void> {
    const target = $event.target as HTMLInputElement;

    if (target.files && target.files.length > 0) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && e.target.result) {
          this.imageSrc = e.target.result;
        } else {
          console.log('image is null');
        }
      };

      reader.readAsDataURL(target.files[0]);
      this.selectedImage = await this.storageService.uploadImage(
        target.files[0]
      );
    } else {
      console.log('targe.files is null');
    }
  }

  // Handle Submit form
  async handleSubmit(): Promise<void> {
    const data: Post = {
      title: this.postForm.value.title,
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      category: {
        name: this.postForm.value.category.split('-')[0],
        id: this.postForm.value.category.split('-')[1],
      },
      image: this.selectedImage,
      permalink: this.permalinkControl.value,
      isFeatured: false,
      views: 0,
      createdAt: new Date(),
      status: 'new',
    };

    await this.postService.createPost(data);
    this.postForm.reset();
    this.router.navigate(['/posts']);
  }
}
