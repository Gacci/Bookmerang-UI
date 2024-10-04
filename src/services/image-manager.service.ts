import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageManagerService {
  constructor(private http: HttpClient) {}

  upload(files: File[]) {
    const form = new FormData();
    files.forEach((file: File) => form.append('images', file));
    return this.http.post('http://127.0.0.1:3000/images', form);
  }

  remove(id: number) {
    return this.http.delete(`http://127.0.0.1:3000/images/${id}`);
  }
}
