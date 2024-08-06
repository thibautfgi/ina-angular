import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, PLATFORM_ID, Inject, Input } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { LibavInitService } from '../../services/libav-init.service';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [NgIf],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit, AfterViewInit {

  @Input() framesNumber$: Observable<number>;
  @Input() videoFrames$!: Observable<any>;
  @Input() customHeight$: Observable<number>;
  @Input() customWidth$: Observable<number>;
  @Input() fps$: Observable<number>;

  @ViewChild('myRange')  //permet de suivre le changement de donne interne au html
  slider!: ElementRef<HTMLInputElement>;
  @ViewChild('demo')
  output!: ElementRef<HTMLDivElement>;

  maxFrames: number = 0; // Will be updated dynamically
  customHeight: number = 150; // default value, will be updated from customHeight$
  customWidth: number = 300; // default value, will be updated from customWidth$
  private fps: number = 25; // default value, will be updated from fps$
  videoFrames: any;
  private previousSelectedImage: number = -1; // Track the previously selected image
  loading: boolean = true; // Loading, permet de suivre si les données sont load ou non

  constructor(
    private libavInitService: LibavInitService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.framesNumber$ = this.libavInitService.framesNumber$;
    this.videoFrames$ = this.libavInitService.videoFrames$;
    this.customHeight$ = this.libavInitService.customHeight$;
    this.customWidth$ = this.libavInitService.customWidth$;
    this.fps$ = this.libavInitService.fps$;
    
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      combineLatest([
        this.fps$,
        this.framesNumber$,
        this.videoFrames$,
        this.customHeight$,
        this.customWidth$,
      ]).subscribe(([fps, framesNumber, videoFrames, customHeight, customWidth]) => {
        this.fps = fps;
        this.customHeight = customHeight;
        this.customWidth = customWidth;
        this.videoFrames = videoFrames;
        if (framesNumber !== null && videoFrames !== null && videoFrames.length > 0) {
          this.maxFrames = framesNumber; // Update the maxFrames value
          this.loading = false
          const value = this.slider.nativeElement.value;
          this.updateTimestampSlider(value ,this.maxFrames, fps)
          this.buildImage(this.videoFrames, this.customHeight, this.customWidth, this.fps, 0); // i hope the first frame is alway a keyframe uu
          if (this.slider) {
            this.slider.nativeElement.max = framesNumber.toString();
          }
        }
      });
    } else {
      console.warn('ngOnInit called in non-browser environment');
    }
  }

  ngAfterViewInit(): void {
    if (this.slider && this.maxFrames > 0) {
      this.slider.nativeElement.max = this.maxFrames.toString();
    }

    // Set the initial value
    this.initTimestampSlider("00:00:00.00", this.maxFrames, this.fps);

    // si slider bouge, update value
    this.slider.nativeElement.oninput = () => {
      const value = this.slider.nativeElement.value;
      console.log('Slider value:', value);
      this.updateTimestampSlider(value, this.maxFrames, this.fps);
      const selectedImage = this.selectImageFromSlider(parseInt(value), this.videoFrames);
      
      // assure the img is build only when slected img changed
      if (selectedImage !== this.previousSelectedImage) {
        this.buildImage(this.videoFrames, this.customHeight, this.customWidth, this.fps, selectedImage);
        this.previousSelectedImage = selectedImage; // Update the previously selected image
      }
    };
  }


  // renvoie le frame number le plus proche du targetFrameNumber parmis les selected videoframes
  selectImageFromSlider(targetFrameNumber: number, videoFrames: any[]): number {
    if (videoFrames.length === 0) {
      return 0;
    }

    let closestIndex = 0;
    let minDiff = Math.abs(videoFrames[0].frameNumber - targetFrameNumber);

    for (let i = 1; i < videoFrames.length; i++) {
      const diff = Math.abs(videoFrames[i].frameNumber - targetFrameNumber);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    console.log(`Selected frame index: ${closestIndex}, frameNumber: ${videoFrames[closestIndex].frameNumber}`);
    return closestIndex;
  }



  // Draw only the selected frame into imageSliderContainer
  buildImage(videoFrames: any[], customHeight: number, customWidth: number, fps: number, selectedImage: number): void {
    const imageSliderContainer: HTMLElement = document.getElementById('imageSliderContainer') as HTMLElement;
    if (!imageSliderContainer) {
      console.error('imageSliderContainer not found');
      return;
    }

    // Clear any existing content in the container
    imageSliderContainer.innerHTML = '';

    if (videoFrames.length > 0) {
      const frame = videoFrames[selectedImage]; // notre frame selectionner
      const timestamp = this.calculateTimestamp(frame.frameNumber, fps);
      const formattedTimestamp = this.formatTimestamp(timestamp);
      const canvas = this.drawFrame(frame.frame, customWidth, customHeight, formattedTimestamp);
      if (canvas) {
        imageSliderContainer.appendChild(canvas);
      }
    }
  }

  // Draw the frame
  drawFrame(videoFrame: VideoFrame, customWidth: number, customHeight: number, timestamp: string): HTMLCanvasElement | null {
    if (!videoFrame) {
      console.error('Display frame not found');
      return null;
    }

    // Create a canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = customWidth;
    canvas.height = customHeight;

    createImageBitmap(videoFrame).then(imageBitmap => {
      ctx.drawImage(imageBitmap, 0, 0, customWidth, customHeight);
      // Draw the timestamp on the image
      ctx.font = '16px Arial';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 4;
      ctx.strokeText(timestamp, 10, 20);
      ctx.fillText(timestamp, 10, 20);
    }).catch(error => {
      console.error('Error creating image bitmap:', error);
    });

    return canvas;
  }


  // place le timestamp a zero
  initTimestampSlider(value: string, maxValue: number, fps: number): void {
    this.output.nativeElement.innerHTML = value + " / " + "00:00:00.00";
  }

  // update le timestamp 
  updateTimestampSlider(value: string, maxValue: number, fps: number): void {
    this.output.nativeElement.innerHTML = this.formatTimestamp(this.calculateTimestamp(parseInt(value), fps)) + " / " + this.formatTimestamp(this.calculateTimestamp((maxValue), fps));
  }

  // Calculate the timestamp for a given frame, result in second
  calculateTimestamp(frameNumber: number, fps: number): number {
    return frameNumber / fps;
  }

  // Format the timestamp as hours:minutes:seconds:centiseconds
  formatTimestamp(timestamp: number): string {
    const hours = Math.floor(timestamp / 3600);
    const minutes = Math.floor((timestamp % 3600) / 60);
    const seconds = Math.floor(timestamp % 60);
    const centiseconds = Math.floor((timestamp % 1) * 100); // homemade centiseconds

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}.${this.pad(centiseconds, 2)}`;
  }

  // add zero in front of every category of the timestamp
  pad(num: number, size: number = 2): string {
    let s = num.toString();
    while (s.length < size) s = '0' + s;
    return s;
  }
}
