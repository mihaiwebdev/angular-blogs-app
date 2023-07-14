import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: Storage = inject(Storage);
  private toastr: ToastrService = inject(ToastrService);

  // Add image to fire storage
  async uploadImage(image: File): Promise<string> {
    const filePath = `postImages/${Date.now()}`;
    let imagePath: string = '';

    const storageRef = ref(this.storage, filePath);

    try {
      const snapshot = await uploadBytes(storageRef, image);
      if (snapshot && snapshot.metadata) {
        imagePath = await getDownloadURL(
          ref(this.storage, snapshot.metadata.fullPath)
        );
      }
      this.toastr.success('Image uploaded!');
    } catch (error) {
      console.error(error);
      this.toastr.error('Something went wrong!');
    }

    return imagePath;
  }

  // Delete image
  async deleteImage(imgPath: string): Promise<void> {
    const desertRef = ref(this.storage, imgPath);
    try {
      await deleteObject(desertRef);
      console.log('image deleted');
    } catch (error) {
      console.error(error);
    }
  }
}
