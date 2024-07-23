import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { LibavInitService } from '../../services/libav-init.service';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { StoryBoardComponent } from '../story-board/story-board.component';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [AsyncPipe, StoryBoardComponent],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit, OnDestroy {

  videoName$: Observable<string>;
  moduloNumber$: Observable<number>;

  private subscriptions: Subscription = new Subscription();

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private libavInitService: LibavInitService,
  ) {
    this.videoName$ = this.libavInitService.videoName$;
    this.moduloNumber$ = this.libavInitService.moduloNumber$;
  }

  ngOnInit() { 
    if (isPlatformBrowser(this.platformId)) {
      this.loadLibAV();
    }
  }

  loadLibAV() {
    const script = document.createElement('script');
    script.src = 'assets/libav/libav-5.4.6.1.1-webm-vp9.js';
    script.onload = () => {
      const videoNameSub = this.videoName$.subscribe(async videoName => {
        const moduloNumberSub = this.moduloNumber$.subscribe(async moduloNumber => {
          try {
            await this.libavInitService.initLibAV(videoName, moduloNumber);
          } catch (error) {
            console.error('Error initializing storyboard:', error);
          }
        });
        this.subscriptions.add(moduloNumberSub);
      });
      this.subscriptions.add(videoNameSub);
    };
    document.body.appendChild(script);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
