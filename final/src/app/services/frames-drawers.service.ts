import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FramesDrawersService {
  private videoName = new BehaviorSubject<string>("sample640x360.webm");
  videoName$: Observable<string> = this.videoName.asObservable();

  constructor() { }

  setVideoName(newName: string): void {
    this.videoName.next(newName);
  }
}
