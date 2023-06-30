import { Component } from '@angular/core';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent {
  permalink!: string;
  imageSrc: any = './assets/image-placeholder.jpg';
  selectedImage: string = '';

  // Creatte title slug
  onTitleChange($event: KeyboardEvent): void {
    const target = $event.target as HTMLInputElement;
    this.permalink = target?.value.replace(/\s/g, '-');
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
    }
  }
}
