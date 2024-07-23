import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare var LibAV: any;

@Injectable({
  providedIn: 'root'
})
export class LibavInitService {
  private videoName = new BehaviorSubject<string>("sample640x360.webm");
  private moduloNumber = new BehaviorSubject<number>(10);
  private frames = new BehaviorSubject<any[]>([]);

  videoName$: Observable<string> = this.videoName.asObservable();
  moduloNumber$: Observable<number> = this.moduloNumber.asObservable();
  frames$: Observable<any[]> = this.frames.asObservable();

  constructor() { }

  setVideoName(newName: string): void {
    this.videoName.next(newName);
  }

  async initLibAV(videoName: string, moduloNumber: number) {
    try {
      console.time("Temps Total");

      // Initialize LibAV
      const libav = await LibAV.LibAV();

      // Fetch la video
      console.log("Starting Fetch...");
      console.time("Temps de Fetch");
      const videoData = await fetch(`assets/video/${videoName}`)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          console.timeEnd("Temps de Fetch");
          return response.arrayBuffer();
        });

      await libav.writeFile(videoName, new Uint8Array(videoData));

      console.log("Starting Demuxe...");
      console.time("Demuxe");
      const [fmt_ctx, [stream]] = await libav.ff_init_demuxer_file(videoName);
      console.timeEnd("Demuxe");

      console.log("Starting Decode...");
      console.time("Decode");
      const [, codecContext, packet, frame] = await libav.ff_init_decoder(stream.codec_id, stream.codecpar);
      console.timeEnd("Decode");

      console.log("Starting lis et decode les frames...");
      console.time("Lis et decode les frames");
      const [, packets] = await libav.ff_read_frame_multi(fmt_ctx, packet);
      const framesData = await libav.ff_decode_multi(codecContext, packet, frame, packets[stream.index], true);

      console.log(`Extracted ${framesData.length} frames from the video!`);

      console.timeEnd("Lis et decode les frames");

      this.frames.next(framesData.map((frame: any, index: number) => ({ ...frame, index })));

    } catch (error) {
      console.error('Failed to load or process the video:', error);
      throw error;  // Propagate error to be handled by caller
    }
  }
}
