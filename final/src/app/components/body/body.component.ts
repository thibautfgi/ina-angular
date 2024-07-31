import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { LibavInitService } from '../../services/libav-init.service';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { StoryBoardComponent } from '../story-board/story-board.component';
import { Observable, Subscription } from 'rxjs';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [AsyncPipe, StoryBoardComponent, HeaderComponent],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  videoName$: Observable<string>;
  moduloNumber$: Observable<number>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private libavInitService: LibavInitService,
  ) {
    this.videoName$ = this.libavInitService.videoName$;
    this.moduloNumber$ = this.libavInitService.moduloNumber$;
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Load LibAV script
      await this.loadScript('assets/variant-webcodecs/dist/libav-5.4.6.1.1-webcodecs.js');
      // Load LibAVWebCodecsBridge script
      await this.loadScript('assets/libavjs-webcodecs-bridge/dist/libavjs-webcodecs-bridge.js');
      
      // Initialize LibAV
      this.libavInitService.initLibAV();
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script ${src}`));
      document.body.appendChild(script);
    });
  }
}
