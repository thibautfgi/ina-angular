import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // permet de voir si le code run sur le browser uniquement

declare var LibAV: any;

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  async ngOnInit() { // au demarrage

    // load ce script sur le browser uniquement
    if (isPlatformBrowser(this.platformId)) {
      const script = document.createElement('script');
      script.src = 'assets/libav/libav-5.4.6.1.1-webm-vp9.js';
      script.onload = () => this.initLibAV();
      document.body.appendChild(script);
    }

  }

  async initLibAV() {
    try {
      console.time("here");
      const frameNumber = 299;  // select the frame number here

      // Initialize LibAV
      const libav = await LibAV.LibAV();

      // Fetch la video
      console.time("here0");
      const videoData = await fetch('assets/video/sample640x360.webm')
      
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          console.timeEnd("here0");
          return response.arrayBuffer();
        });


        
      await libav.writeFile('sample640x360.webm', new Uint8Array(videoData));

      // demuxer la video = separe en plusieur canal (video, audio...)
      const [fmt_ctx, [stream]] = await libav.ff_init_demuxer_file('sample640x360.webm');
      console.log(stream);

      // initilise le decoder pour lire la partie video demuxer
      const [, codecContext, packet, frame] = await libav.ff_init_decoder(stream.codec_id, stream.codecpar);

      
      // lis les frames en packets puis les decodes en frames
      const [, packets] = await libav.ff_read_frame_multi(fmt_ctx, packet);
      const frames = await libav.ff_decode_multi(codecContext, packet, frame, packets[stream.index], true);
      console.log(`Extracted ${frames.length} frames from the video!`);

      const displayFrame = frames[frameNumber]; // notre frame selectionner

      // l'emplacement de notre frame
      const canvas: HTMLCanvasElement = document.getElementById('videoCanvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d')!;
      canvas.width = displayFrame.width;
      canvas.height = displayFrame.height;

      console.timeEnd("here");
      console.time("here1");

       // le bazard pour cree une image
        if (frames.length >= frameNumber) {
          console.log('First frame:', displayFrame);

          const yPlane = displayFrame.data.subarray(displayFrame.layout[0].offset, displayFrame.layout[0].offset + displayFrame.layout[0].stride * displayFrame.height);

          const imgData = ctx.createImageData(displayFrame.width, displayFrame.height);
          for (let y = 0; y < displayFrame.height; y++) {
            for (let x = 0; x < displayFrame.width; x++) {
              const yIndex = y * displayFrame.layout[0].stride + x;
              const imgIndex = y * displayFrame.width + x;
              const value = yPlane[yIndex];
              imgData.data[imgIndex * 4] = value;       // R
              imgData.data[imgIndex * 4 + 1] = value;   // G
              imgData.data[imgIndex * 4 + 2] = value;   // B
              imgData.data[imgIndex * 4 + 3] = 255;     // A
            }
          }
          ctx.putImageData(imgData, 0, 0);
          console.timeEnd("here1");
      } else {
        console.error('No frames available to display or data is not accessible');
      }
    } catch (error) {
      console.error('Failed to load or process the video:', error);
    }
  }
}
