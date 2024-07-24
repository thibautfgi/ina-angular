import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { LibavInitService } from '../../services/libav-init.service';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-frames-drawer',
  standalone: true,
  templateUrl: './frames-drawer.component.html',
  styleUrls: ['./frames-drawer.component.css']
})
export class FramesDrawerComponent implements OnInit {

  @Input()
  videoFrames$!: Observable<any>;
  test: any;

  constructor(
    private libavInitService: LibavInitService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.videoFrames$ = this.libavInitService.videoFrames$;
    }
  }

  ngOnInit(): void { //called on non browser environnement
    if (isPlatformBrowser(this.platformId)) {
      this.videoFrames$.subscribe(value => {
        this.test = value;
        this.DrawFrame(value);
      });
    } else {
      console.warn('ngOnInit called in non-browser environment');
    }
  }


  DrawFrame(value: any): void {
    if (isPlatformBrowser(this.platformId)) {
      const storyboardContainer: HTMLElement = document.getElementById('storyboard') as HTMLElement;


      console.log("Starting Image drawer...");
      console.time("Image Drawer");

      const displayFrame = value[0]; // assuming we want the first frame

      if (!displayFrame) {
        console.error('Display frame not found');
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = displayFrame.width;
      canvas.height = displayFrame.height;

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
      ctx.putImageData(imgData, 0, 0);

      storyboardContainer.appendChild(canvas);

      console.timeEnd("Image Drawer");
    } else {
      console.warn('DrawFrame called in non-browser environment');
    }
  }
}
