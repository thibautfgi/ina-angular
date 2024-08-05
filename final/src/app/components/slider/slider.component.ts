import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, PLATFORM_ID, Inject, Input } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { LibavInitService } from '../../services/libav-init.service';

@Component({
  selector: 'app-slider',
  standalone: true,
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit, AfterViewInit {

  @Input() framesNumber$: Observable<number>;
  @Input() videoFrames$!: Observable<any>;
  @Input() customHeight$: Observable<number>;
  @Input() customWidth$: Observable<number>;
  @Input() fps$: Observable<number>;

  @ViewChild('myRange')
  slider!: ElementRef<HTMLInputElement>;
  @ViewChild('demo')
  output!: ElementRef<HTMLDivElement>;

  maxFrames: number = 0; // Will be updated dynamically
  private fps: number = 25; // default value, will be updated from fps$
  private previousFrameCount: number = 0; // Track the number of previously drawn frames

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
        if (framesNumber !== null && videoFrames !== null && videoFrames.length > 0) {
          this.maxFrames = framesNumber; // Update the maxFrames value
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
    this.initOutput("00:00:00.00", this.maxFrames, this.fps);

    // Update the value when the slider is moved
    this.slider.nativeElement.oninput = () => {
      this.updateOutput(this.slider.nativeElement.value, this.maxFrames, this.fps);
    };
  }

  initOutput(value: string, maxValue: number, fps: number): void {
    this.output.nativeElement.innerHTML = value + " / "+ this.formatTimestamp(this.calculateTimestamp((maxValue), fps))
  }

  updateOutput(value: string, maxValue: number, fps: number): void {
    this.output.nativeElement.innerHTML = this.formatTimestamp(this.calculateTimestamp(parseInt(value), fps)) + " / "+ this.formatTimestamp(this.calculateTimestamp((maxValue), fps))
  }

  // Calculate the timestamp for a given frame
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

  // Pad numbers with leading zeros
  pad(num: number, size: number = 2): string {
    let s = num.toString();
    while (s.length < size) s = '0' + s;
    return s;
  }
}
