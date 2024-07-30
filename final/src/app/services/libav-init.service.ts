import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare var LibAV: any;

@Injectable({
  providedIn: 'root'
})
export class LibavInitService {

  private videoName = new BehaviorSubject<string>("test2.webm"); // video to use
  private moduloNumber = new BehaviorSubject<number>(10); // number of frames to select based on modulo, here 10 = 100 frames = 10 final
  private customHeight = new BehaviorSubject<number>(150); // image height size
  private customWidth = new BehaviorSubject<number>(300); // image width size

  private videoFrames = new BehaviorSubject<any[]>([]);
  private framesNumber = new BehaviorSubject<number>(0);  // Initialize with 0
  private fps = new BehaviorSubject<number>(0); // Initialize with 0
  private duration = new BehaviorSubject<number>(0); // Initialize with 0

  videoName$: Observable<string> = this.videoName.asObservable();
  moduloNumber$: Observable<number> = this.moduloNumber.asObservable();
  videoFrames$: Observable<any[]> = this.videoFrames.asObservable();
  framesNumber$: Observable<number> = this.framesNumber.asObservable();
  customHeight$: Observable<number> = this.customHeight.asObservable();
  customWidth$: Observable<number> = this.customWidth.asObservable();
  duration$: Observable<number> = this.duration.asObservable();
  fps$: Observable<number> = this.fps.asObservable();

  constructor() { }

  async initLibAV() {
    try {
      console.time("Temps Init");

      const videoName = this.videoName.getValue();
      const moduloNumber = this.moduloNumber.getValue();
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
      if (videoIdx === -1) throw new Error("Video stream not found");

      const videoStream = streams[videoIdx];

      console.log("Starting reading frames...");
      console.time("Reading frames");

      // Read all packets
      const [result, packets] = await libav.ff_read_frame_multi(fmt_ctx, await libav.av_packet_alloc());
      console.timeEnd("Reading frames");
      console.timeEnd("Temps Init");

      if (result === libav.AVERROR_EOF) {
        console.log("End of file reached");
      }
      const totalFrames = packets[videoStream.index].length;
      this.framesNumber.next(totalFrames);

      console.log(`Total number of frames in the video: ${totalFrames}`);
      
      // Select the first 10 frames
      const selectedPackets1 = packets[videoStream.index].slice(0, 5);
      const selectedPackets2 = packets[videoStream.index].slice(200, 205);
      
      // Concatenate the selected packets
      const selectedPackets = selectedPackets1.concat(selectedPackets2);

      console.log("Selected Packets", selectedPackets);
      console.log(`Selected ${selectedPackets.length} packets based on first 10 frames`);

      // Initialize the WebCodecs VideoDecoder
      console.log("Initializing WebCodecs VideoDecoder");
      const videoDecoderConfig = {
        codec: 'vp09.00.10.08', // VP9 codec string
        codedWidth: videoStream.codecpar.width,
        codedHeight: videoStream.codecpar.height,
      };

      const framesData: any[] = [];
      const videoDecoder = new VideoDecoder({
        output: frame => {
          framesData.push(frame);
          console.log(`Frame ${framesData.length}:`, frame);
        },
        error: e => console.error('Error decoding frame:', e)
      });

      videoDecoder.configure(videoDecoderConfig);

      // Decode each selected packet
      for (const pkt of selectedPackets) {
        try {
          const chunk = new EncodedVideoChunk({
            type: pkt.flags & 1 ? 'key' : 'delta',
            timestamp: pkt.pts,
            data: new Uint8Array(pkt.data)
          });
          videoDecoder.decode(chunk);
        } catch (error) {
          console.error(`Failed to decode packet at index ${selectedPackets.indexOf(pkt)}:`, error);
        }
      }

      // Flush the decoder
      await videoDecoder.flush();

      console.log(`Total number of decoded frames: ${framesData.length}`);
      this.videoFrames.next(framesData);

      console.log("------------------");
      console.log("Frame Number = " + totalFrames);
      console.log("Modulo number = " + moduloNumber);
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
