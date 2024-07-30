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
export class BodyComponent implements OnInit{

  videoName$: Observable<string>;
  moduloNumber$: Observable<number>;



  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private libavInitService: LibavInitService,
  ) {
    this.videoName$ = this.libavInitService.videoName$;
    this.moduloNumber$ = this.libavInitService.moduloNumber$;
  }


  async ngOnInit() { // au demarrage
    // load ce script sur le browser uniquement
    if (isPlatformBrowser(this.platformId)) {
      const script = document.createElement('script');
      //script.src = 'assets/libav/libav-5.4.6.1.1-webm-vp9.js';
      //script.src = 'assets/libav-cli/libav-5.4.6.1.1-webm-vp9-cli.js';
      script.src = 'assets/variant-webcodecs/dist/libav-5.4.6.1.1-webcodecs.js'
      //script.src = 'assets/libav-default/libav-5.4.6.1.1-webm-vp9-cli.wasm.js';
      script.onload = () => this.libavInitService.initLibAV();
      document.body.appendChild(script);
    }
  }  





}
