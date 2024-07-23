import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser, NgFor } from '@angular/common';

declare var LibAV: any;

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [NgFor],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})



export class BodyComponent implements OnInit {

  frameNumber = 299;  // select the frame number here
  videoName = "sample960x400-0.47s.webm"; // la vidéo a extraire

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
      console.time("Temps Total");

      // Initialize LibAV
      const libav = await LibAV.LibAV();

      // Fetch la video
      console.log("Starting Fetch...");
      console.time("Temps de Fetch");
      const videoData = await fetch(`assets/video/${this.videoName}`)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          console.timeEnd("Temps de Fetch");
          return response.arrayBuffer();
        });

      await libav.writeFile(`${this.videoName}`, new Uint8Array(videoData));

      console.log("Starting Demuxe...");
      console.time("Demuxe");
      // demuxer la video = separe en plusieur canal (video, audio...)
      const [fmt_ctx, [stream]] = await libav.ff_init_demuxer_file(`${this.videoName}`);
      console.timeEnd("Demuxe");

      console.log("Starting Decode...");
      console.time("Decode");
      // initilise le decoder pour lire la partie video demuxer
      const [, codecContext, packet, frame] = await libav.ff_init_decoder(stream.codec_id, stream.codecpar);
      console.timeEnd("Decode");

      console.log("Starting lis et decode les frames...");
      console.time("Lis et decode les frames");
      // lis les frames en packets puis les decodes en frames

      const [, packets] = await libav.ff_read_frame_multi(fmt_ctx, packet);
      const frames = await libav.ff_decode_multi(codecContext, packet, frame, packets[stream.index], true);

      console.log(`Extracted ${frames.length} frames from the video!`);

      const frameStoryBoard = Math.floor(frames.length / 10); 
      // prend le nombre de frames pour le storyboard avec un modulo de 10:  200frames = 20storyboard

      console.log(`Storyboard will have ${frameStoryBoard} frames!`);
      console.timeEnd("Lis et decode les frames");

      // Create storyboard frames
      const storyboardContainer: HTMLElement = document.getElementById('storyboard') as HTMLElement;

      console.log("Starting Image drawer...");
      console.time("Image Drawer");
      for (let z = 0; z < frameStoryBoard; z++) {
        const displayFrame = frames[z * 10]; // assuming every 10th frame for storyboard

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
      }

      console.timeEnd("Image Drawer");
      console.timeEnd("Temps Total");
    } catch (error) {
      console.error('Failed to load or process the video:', error);
    }
  }
}
