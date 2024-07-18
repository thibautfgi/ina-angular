// src/app/services/video.service.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('API_URL') apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  probeVideo(path: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/probe`, { path });
  }

  extractThumbnail(path: string, timestamp: string = '00:00:01'): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/api/extract-thumbnail`, { path, timestamp }, { responseType: 'blob' });
  }
}
