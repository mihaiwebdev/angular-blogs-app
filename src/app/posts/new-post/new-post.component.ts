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
import { Router } from '@angular/router';
import { Post } from '../../interfaces/post';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  imageSrc: any = './assets/image-placeholder.jpg';
  categories!: Category[];
  selectedImage!: File;
  postForm!: FormGroup;
  permalinkControl!: FormControl;

  constructor(
    private categoryService: CategoriesService,
    private formBuilder: FormBuilder,
    private postService: PostsService,
    private router: Router
  ) {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      permalink: [{ value: '', disabled: true }, Validators.required],
      excerpt: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      image: ['', Validators.required],
      content: ['', Validators.required],
    });

    this.permalinkControl = this.postForm.get('permalink') as FormControl;
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

  // Select image
  selectImage($event: Event) {
    const target = $event.target as HTMLInputElement;

    if (target.files && target.files.length > 0) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.imageSrc = e.target?.result;
      };

      reader.readAsDataURL(target.files[0]);
      this.selectedImage = target.files[0];
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
      image: '',
      permalink: this.postForm.value.permalink,
      isFeatured: false,
      views: 0,
      createdAt: new Date(),
      status: 'new',
    };
    // data.image = this.selectedImage;
    await this.postService.createPost(data);
    this.postForm.reset();
    this.router.navigate(['/posts']);
  }
}
