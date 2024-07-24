import { Component, Input, OnInit, Inject, PLATFORM_ID, input } from '@angular/core';
import { LibavInitService } from '../../services/libav-init.service';
import { Observable } from 'rxjs';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-story-board',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './story-board.component.html',
  styleUrls: ['./story-board.component.css']
})
export class StoryBoardComponent implements OnInit {

  @Input() framesNumber$: Observable<number>;
  @Input() moduloNumber$: Observable<number>;
  @Input() videoFrames$!: Observable<any>;
  @Input() customHeight$: Observable<number>;
  @Input() customWidht$: Observable<number>;



  @Input() frameRate: number = 30; // frame rate by default, pb to get framerate on initlibav

  constructor(
    private libavInitService: LibavInitService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.framesNumber$ = this.libavInitService.framesNumber$;
    this.moduloNumber$ = this.libavInitService.moduloNumber$;
    this.videoFrames$ = this.libavInitService.videoFrames$;
    this.customHeight$ = this.libavInitService.customHeight$;
    this.customWidht$ = this.libavInitService.customWidht$;
  }

 

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.framesNumber$.subscribe(framesNumber => {
        if (framesNumber !== null) {
          this.moduloNumber$.subscribe(moduloNumber => {
            if (moduloNumber !== null) {
              this.videoFrames$.subscribe(videoFrames => {
                if (videoFrames !== null) {
                  this.customHeight$.subscribe(customHeight => {
                    this.customWidht$.subscribe(customWidth => {
                      console.log("Starting Draw frame...");
                     
                      this.buildStoryBoard(framesNumber, moduloNumber, videoFrames, customHeight, customWidth);
                      console.timeEnd("Draw frame");
                      
                    });
                  });
                } else {
                  console.warn('Video frames are null, skipping buildStoryBoard');
                }
              });
            } else {
              console.warn('Modulo number is null, skipping buildStoryBoard');
            }
          });
        } else {
          console.warn('Frames number is null, skipping buildStoryBoard');
        }
      });
    } else {
      console.warn('ngOnInit called in non-browser environment');
    }
  }

  buildStoryBoard(framesNumber: number, moduloNumber: number, videoFrames: any, customHeight: number, customWidth: number): void {
    console.time("Draw frame");
    const frameToPrint = Math.floor(framesNumber / moduloNumber);
    const numberOfRows = Math.ceil(frameToPrint / 5); // Calculate number of rows tto containe the img

    const storyboardContainer: HTMLElement = document.getElementById('storyContainer') as HTMLElement;

    // Check if storyboardContainer exists
    if (!storyboardContainer) {
      console.error('Storyboard container not found');
      return;
    }

    // Clear existing content
    storyboardContainer.innerHTML = '';

    for (let i = 0; i < numberOfRows; i++) {
      const row = document.createElement('div');
      row.classList.add('d-flex', 'flex-row', 'mb-3'); // Bootstrap classes for row layout

      for (let j = 0; j < 5; j++) {
        const index = i * 5 + j;
        if (index >= frameToPrint) break; // Stop if we've created all needed squares

        const col = document.createElement('div');
        col.classList.add('flex-fill'); // Bootstrap class for flexible width

        const canvas = this.DrawFrame(videoFrames[index*moduloNumber], customWidth, customHeight, index, moduloNumber); // Generate the frame canvas with resizing and timecode
        if (canvas) {
          col.appendChild(canvas);
        }

        row.appendChild(col);
      }
      storyboardContainer.appendChild(row);
    }
  }

  DrawFrame(displayFrame: any, customWidth: number, customHeight: number, frameIndex: number, moduloNumber: number): HTMLCanvasElement | null {
    if (isPlatformBrowser(this.platformId)) {

      if (!displayFrame) { // error or error what is the question
        console.error('Display frame not found');
        return null;
      }

      

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = customWidth;
      canvas.height = customHeight;


      // magie magie
      const yPlane = displayFrame.data.subarray(displayFrame.layout[0].offset, displayFrame.layout[0].offset + displayFrame.layout[0].stride * displayFrame.height);
      const uPlane = displayFrame.data.subarray(displayFrame.layout[1].offset, displayFrame.layout[1].offset + displayFrame.layout[1].stride * (displayFrame.height / 2));
      const vPlane = displayFrame.data.subarray(displayFrame.layout[2].offset, displayFrame.layout[2].offset + displayFrame.layout[2].stride * (displayFrame.height / 2));

      const imgData = ctx.createImageData(displayFrame.width, displayFrame.height);
      for (let y = 0; y < displayFrame.height; y++) {
        for (let x = 0; x < displayFrame.width; x++) {
          const yIndex = y * displayFrame.layout[0].stride + x;
          const uIndex = Math.floor(y / 2) * displayFrame.layout[1].stride + Math.floor(x / 2);
          const vIndex = Math.floor(y / 2) * displayFrame.layout[2].stride + Math.floor(x / 2);

          const Y = yPlane[yIndex];
          const U = uPlane[uIndex] - 128;
          const V = vPlane[vIndex] - 128;

          const R = Y + 1.402 * V;
          const G = Y - 0.344 * U - 0.714 * V;
          const B = Y + 1.772 * U;

          const imgIndex = y * displayFrame.width + x;
          imgData.data[imgIndex * 4] = R;       // R
          imgData.data[imgIndex * 4 + 1] = G;   // G
          imgData.data[imgIndex * 4 + 2] = B;   // B
          imgData.data[imgIndex * 4 + 3] = 255; // A
        }
      }

      // Create a temporary canvas to draw the original image
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCanvas.width = displayFrame.width;
      tempCanvas.height = displayFrame.height;
      tempCtx.putImageData(imgData, 0, 0);

      // Draw the resized image on the main canvas
      ctx.drawImage(tempCanvas, 0, 0, customWidth, customHeight);

      // Calculate and draw the timecode
      const timeInSeconds = frameIndex*moduloNumber / this.frameRate;
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      const milliseconds = Math.floor((timeInSeconds % 1) * 1000);
      const timecode = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;


      //font timecode
      ctx.font = '16px Arial';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.strokeText(timecode, 10, 30); 
      ctx.fillText(timecode, 10, 30);

      return canvas;
    } else {
      console.warn('DrawFrame called in non-browser environment');
      return null;
    }
  }
}
