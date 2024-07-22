import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser, NgFor } from '@angular/common';


declare var LibAV: any;

@Component({
  selector: 'app-frames-drawer',
  standalone: true,
  imports: [NgFor],
  templateUrl: './frames-drawer.component.html',
  styleUrl: './frames-drawer.component.css'
})
export class FramesDrawerComponent implements OnInit {

  frameNumber = 299;  // select the frame number here
  frameStoryBoard = Math.floor(this.frameNumber / 5) // prend le numbre de frame a envoyé


  videoName = "sample640x360.webm" // la vidéo a extraire

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
      console.log("Starting Fetch...")
      console.time("Temps de Fetch");
      const videoData = await fetch(`assets/video/${this.videoName}`)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          console.timeEnd("Temps de Fetch");
          return response.arrayBuffer();
        });


        
      await libav.writeFile(`${this.videoName}`, new Uint8Array(videoData));

      console.log("Starting Demuxe...")
      console.time("Demuxe")
      // demuxer la video = separe en plusieur canal (video, audio...)
      const [fmt_ctx, [stream]] = await libav.ff_init_demuxer_file(`${this.videoName}`);
      //console.log(stream);
      console.timeEnd("Demuxe")

      console.log("Starting Decode...")
      console.time("Decode")
      // initilise le decoder pour lire la partie video demuxer
      const [, codecContext, packet, frame] = await libav.ff_init_decoder(stream.codec_id, stream.codecpar);
      console.timeEnd("Decode")
      
      console.log("Starting lis et decode les frames...")
      console.time("Lis et decode les frames")
      // lis les frames en packets puis les decodes en frames
      const [, packets] = await libav.ff_read_frame_multi(fmt_ctx, packet);
      const frames = await libav.ff_decode_multi(codecContext, packet, frame, packets[stream.index], true);


      console.log(`Extracted ${frames.length} frames from the video!`);
      console.log(`Storyboard have ${this.frameStoryBoard} frames!`);
      
      console.timeEnd("Lis et decode les frames")

      const displayFrame = frames[this.frameNumber]; // notre frame selectionner

      console.log("Starting Canvas...")
      console.time("Canvas")
      // l'emplacement de notre frame
      const canvas: HTMLCanvasElement = document.getElementById('videoCanvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d')!;
      canvas.width = displayFrame.width;
      canvas.height = displayFrame.height;
      console.timeEnd("Canvas")

      console.log("Starting Frame Drawer...")
      console.time("Frame drawer");

       // le bazard pour cree une image
        if (frames.length >= this.frameNumber) {
          //console.log('First frame:', displayFrame);

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
          console.timeEnd("Frame drawer");
          console.timeEnd("Temps Total");
      } else {
        console.error('No frames available to display or data is not accessible');
      }
    } catch (error) {
      console.error('Failed to load or process the video:', error);
    }
  }
}
