import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare var LibAV: any;

@Injectable({
  providedIn: 'root'
})
export class LibavInitService {

  private videoName = new BehaviorSubject<string>("test2.webm"); // video to use
  private customHeight = new BehaviorSubject<number>(150); // image height size
  private customWidth = new BehaviorSubject<number>(300); // image width size
  private moduloNumber = new BehaviorSubject<number>(10);

  private videoFrames = new BehaviorSubject<any[]>([]);
  private framesNumber = new BehaviorSubject<number>(0);  // Initialize with 0
  private fps = new BehaviorSubject<number>(0); // Initialize with 0
  private duration = new BehaviorSubject<number>(0); // Initialize with 0

  videoName$: Observable<string> = this.videoName.asObservable();
  videoFrames$: Observable<any[]> = this.videoFrames.asObservable();
  framesNumber$: Observable<number> = this.framesNumber.asObservable();
  customHeight$: Observable<number> = this.customHeight.asObservable();
  customWidth$: Observable<number> = this.customWidth.asObservable();
  duration$: Observable<number> = this.duration.asObservable();
  fps$: Observable<number> = this.fps.asObservable();
  moduloNumber$: Observable<number> = this.moduloNumber.asObservable();

  constructor() { }

  async initLibAV() {
    try {
      console.time("Temps Init");

      const videoName = this.videoName.getValue();
      const customHeight = this.customHeight.getValue();
      const customWidth = this.customWidth.getValue();

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

      console.log("Starting Demux...");
      console.time("Demux");
      const [fmt_ctx, streams] = await libav.ff_init_demuxer_file(videoName);
      console.timeEnd("Demux");

      console.log("Streams: ", streams);

      // Find the video stream index
      let videoIdx = -1;
      for (let i = 0; i < streams.length; i++) {
        if (streams[i].codec_type === libav.AVMEDIA_TYPE_VIDEO) {
          videoIdx = i;
          break;
        }
      }
      if (videoIdx === -1) throw new Error('No video stream found');

      const videoStream = streams[videoIdx];

      console.log(videoStream.duration);
      console.log("Starting Decode...");
      console.time("Decode");
      const [, codecContext, packet, frame] = await libav.ff_init_decoder(videoStream.codec_id, videoStream.codecpar);
      console.timeEnd("Decode");

      console.log("Starting lis et decode les frames...");
      console.time("Lis et decode les frames");

      // Reading and decoding frames
      const framesData = [];
      let result;
      let packetData;
      while (framesData.length < 10) {
        result = await libav.av_read_frame(fmt_ctx, packet);
        if (result === libav.AVERROR_EOF) break;
        if (result < 0) continue;

        if (packet.stream_index === videoIdx) {
          result = await libav.avcodec_send_packet(codecContext, packet);
          if (result < 0 && result !== libav.AVERROR_EOF && result !== libav.AVERROR(libav.EAGAIN)) {
            console.error('Error sending packet:', libav.ff_error(result));
            continue;
          }

          while (true) {
            result = await libav.avcodec_receive_frame(codecContext, frame);
            if (result === libav.AVERROR_EOF || result === libav.AVERROR(libav.EAGAIN)) break;
            if (result < 0) {
              console.error('Error receiving frame:', libav.ff_error(result));
              break;
            }

            framesData.push(await libav.ff_copyout_frame(frame));
            if (framesData.length >= 10) break;
          }
        }

        await libav.av_packet_unref(packet);
      }

      // Flush the decoder
      await libav.avcodec_send_packet(codecContext, null);
      while (framesData.length < 10) {
        result = await libav.avcodec_receive_frame(codecContext, frame);
        if (result === libav.AVERROR_EOF || result === libav.AVERROR(libav.EAGAIN)) break;
        if (result < 0) {
          console.error('Error receiving frame during flush:', libav.ff_error(result));
          break;
        }

        framesData.push(await libav.ff_copyout_frame(frame));
      }

      console.log(`Extracted ${framesData.length} frames from the video!`);

      console.timeEnd("Lis et decode les frames");
      console.timeEnd("Temps Total");

      this.videoFrames.next(framesData);

      console.log("------------------");
      console.log("Frame Number = " + framesData.length);
      console.log("Video name = " + videoName);
      console.log("customHeight = " + customHeight);
      console.log("customWidth = " + customWidth);
      console.log("------------------");

    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to load or process the video:', error.message);
      } else {
        console.error('Failed to load or process the video:', error);
      }
      throw error;  // Propagate error to be handled by caller
    }
  }
}
