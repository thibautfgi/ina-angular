import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { LibavInitService } from '../../services/libav-init.service';
import { AsyncPipe, isPlatformBrowser, NgIf } from '@angular/common';
import { StoryBoardComponent } from '../story-board/story-board.component';
import { Observable } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { SliderComponent } from "../slider/slider.component";

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [AsyncPipe, StoryBoardComponent, HeaderComponent, SliderComponent, NgIf],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  videoName$: Observable<string>;
  frameNumber$: Observable<number>;
  webCodecsSupported: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private libavInitService: LibavInitService,
  ) {
    this.videoName$ = this.libavInitService.videoName$;
    this.frameNumber$ = this.libavInitService.framesNumber$;
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.webCodecsSupported = this.checkWebCodecsSupport();

      if (!this.webCodecsSupported) {
        console.error('WebCodecs API is not supported in this browser.');
        return;
      }

      // Load the 2 LibAV script
      await this.loadScript('assets/variant-webcodecs/dist/libav-5.4.6.1.1-webcodecs.js');
      await this.loadScript('assets/libavjs-webcodecs-bridge/dist/libavjs-webcodecs-bridge.js');
      
      // Init LibAV
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

  private checkWebCodecsSupport(): boolean {
    return typeof window !== 'undefined' && 'VideoDecoder' in window && 'EncodedVideoChunk' in window;
  }
}
