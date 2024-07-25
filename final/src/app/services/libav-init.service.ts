import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare var LibAV: any;

@Injectable({
  providedIn: 'root'
})


export class LibavInitService {

  private videoName = new BehaviorSubject<string>("sample640x360.webm"); //video a utiliser
  private moduloNumber = new BehaviorSubject<number>(10); //le nbr de frame selectionner depend du modulo, ici 10 = 100frame = 10final
  private customHeight = new BehaviorSubject<number>(150); //tailler hauteur img
  private customWidht = new BehaviorSubject<number>(300); // taille largeur img
  
  private videoFrames = new BehaviorSubject<any[]>([]);
  private framesNumber = new BehaviorSubject<number>(0);  // Initialize with null
  private fps = new BehaviorSubject<number>(0); // Initialize with 0

  
  private duration = new BehaviorSubject<number>(0); // Initialize with null

  videoName$: Observable<string> = this.videoName.asObservable();
  moduloNumber$: Observable<number> = this.moduloNumber.asObservable();
  videoFrames$: Observable<any[]> = this.videoFrames.asObservable();
  framesNumber$: Observable<number> = this.framesNumber.asObservable();
  customHeight$: Observable<number> = this.customHeight.asObservable();
  customWidht$: Observable<number> = this.customWidht.asObservable();
  duration$: Observable<number> = this.duration.asObservable();
  fps$: Observable<number> = this.fps.asObservable();

  constructor() { }

  async initLibAV() {
    try {
      console.time("Temps Init");

      const videoName = this.videoName.getValue();
      const moduloNumber = this.moduloNumber.getValue();

      const customHeight = this.customHeight.getValue();
      const customWidht = this.customWidht.getValue();

      const libav = await LibAV.LibAV();

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
      const [fmt_ctx, streams] = await libav.ff_init_demuxer_file(videoName);
      console.timeEnd("Demuxe");

      console.log("Streams: ", streams);



     // Extract metadata using CLI commands to get fps
    
     console.log("Extracting metadata using CLI commands...");
     const probeCommand = [
       "-hide_banner",
       "-i", videoName
     ];
    await libav.ffmpeg(probeCommand);






      console.log("Starting Decode...");
      console.time("Decode");
      const [, codecContext, packet, frame] = await libav.ff_init_decoder(streams[0].codec_id, streams[0].codecpar);
      console.timeEnd("Decode");

      console.log("Starting lis et decode les frames...");
      console.time("Lis et decode les frames");
      const [, packets] = await libav.ff_read_frame_multi(fmt_ctx, packet);
      const framesData = await libav.ff_decode_multi(codecContext, packet, frame, packets[streams[0].index], true);
      console.timeEnd("Lis et decode les frames");
      console.timeEnd("Temps Init");

      console.log(`Extracted ${framesData.length} frames from the video!`);
      this.framesNumber.next(framesData.length);
      const framesNumber = this.framesNumber.getValue();

      this.videoFrames.next(framesData);

      console.log("------------------");
      console.log("Frame info = too long but here");
      console.log("Frame Number = " + framesNumber);
      console.log("Modulo number = " + moduloNumber);
      console.log("Video name = " + videoName);
      console.log("customHeight = " + customHeight);
      console.log("customWidht = " + customWidht);
      console.log("------------------");

    } catch (error) {
      console.error('Failed to load or process the video:', error);
      throw error;  // Propagate error to be handled by caller
    }
  }
}
