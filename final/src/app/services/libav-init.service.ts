import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare var LibAV: any;

@Injectable({
  providedIn: 'root'
})
export class LibavInitService {

  private videoName = new BehaviorSubject<string>("sample640x360.webm");
  private moduloNumber = new BehaviorSubject<number>(10);
  private videoFrames = new BehaviorSubject<any[]>([]);
  private framesNumber = new BehaviorSubject<number>(0);


  videoName$: Observable<string> = this.videoName.asObservable();
  moduloNumber$: Observable<number> = this.moduloNumber.asObservable();
  videoFrames$: Observable<any[]> = this.videoFrames.asObservable();
  framesNumber$: Observable<number> = this.framesNumber.asObservable();


  constructor() { }

  async initLibAV() {
    try {
      console.time("Temps Init");

      // Get current values from BehaviorSubjects

      const videoName = this.videoName.getValue();
      const moduloNumber = this.moduloNumber.getValue();


      // Initialize LibAV
      const libav = await LibAV.LibAV();

      // Fetch the video
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
      this.framesNumber.next(framesData.length)

      console.timeEnd("Lis et decode les frames");

      console.timeEnd("Temps Init")

      this.videoFrames.next(framesData);


      const videoFrame = this.videoFrames.getValue();

   

      console.log("------------------");
      console.log("Frame info = to long but here");
      console.log("Modulo number = " + moduloNumber);
      console.log("Video name = " + videoName);
      console.log("------------------");

    } catch (error) {
      console.error('Failed to load or process the video:', error);
      throw error;  // Propagate error to be handled by caller
    }
  }
}
