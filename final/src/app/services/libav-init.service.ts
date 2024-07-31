import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare var LibAV: any;
declare var LibAVWebCodecsBridge: any;

@Injectable({
  providedIn: 'root'
})
export class LibavInitService {

  private videoName = new BehaviorSubject<string>("test3.mp4"); // video to use
  private moduloNumber = new BehaviorSubject<number>(10); // Process every frame
  private customHeight = new BehaviorSubject<number>(150); // image height size
  private customWidth = new BehaviorSubject<number>(300); // image width size

  private videoFrames = new BehaviorSubject<any[]>([]);
  private framesNumber = new BehaviorSubject<number>(0);  // Initialize with 0
  private fps = new BehaviorSubject<number>(0); // Initialize with 0
  private duration = new BehaviorSubject<number>(0); // Initialize with 0
  private codec = new BehaviorSubject<string>(""); // Add codec information

  videoName$: Observable<string> = this.videoName.asObservable();
  moduloNumber$: Observable<number> = this.moduloNumber.asObservable();
  videoFrames$: Observable<any[]> = this.videoFrames.asObservable();
  framesNumber$: Observable<number> = this.framesNumber.asObservable();
  customHeight$: Observable<number> = this.customHeight.asObservable();
  customWidth$: Observable<number> = this.customWidth.asObservable();
  duration$: Observable<number> = this.duration.asObservable();
  fps$: Observable<number> = this.fps.asObservable();
  codec$: Observable<string> = this.codec.asObservable(); // Add codec observable

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

      const [result, packets] = await libav.ff_read_frame_multi(fmt_ctx, await libav.av_packet_alloc());
      console.timeEnd("Reading frames");
      console.timeEnd("Temps Init");

      if (result === libav.AVERROR_EOF) {
        console.log("End of file reached");
      }
      const totalFrames = packets[videoStream.index].length;
      this.framesNumber.next(totalFrames);

      const keyFrames = packets[videoStream.index].filter((pkt: any) => pkt.flags & 1);
      const maxKeyFrames = 40;
      const modulo = Math.ceil(keyFrames.length / maxKeyFrames);
      const selectedKeyframes = keyFrames.filter((_: any, index: number) => index % modulo === 0).slice(0, maxKeyFrames);

      console.log("-----------------------------------------------------");
      console.log("Total number of KEYFRAMES in the video: ", keyFrames.length);
      console.log("Total number of FRAMES in the video: ", totalFrames);
      console.log("-----------------------------------------------------");
      console.log("Total number of SELECTED KEYFRAMES in the video: ", selectedKeyframes.length);

      // Extract codec information
      const codec = await libav.avcodec_get_name(videoStream.codec_id);
      console.log(`Codec: ${codec}`);
      this.codec.next(codec); // Update the codec BehaviorSubject

      const trueCodec = this.getCodecString(codec);
      console.log(`Codec String: ${trueCodec}`);

      let videoDecoderConfig: any;

      if (codec !== "vp9" && codec !== "vp8") {
        const extradata = await this.extractExtradataUsingWebCodecs(libav, videoStream);
        if (!extradata) {
          throw new Error('Extradata not found');
        }
        videoDecoderConfig = {
          codec: trueCodec, // Use the codec obtained from the video stream
          codedWidth: videoStream.codecpar.width,
          codedHeight: videoStream.codecpar.height,
          description: extradata
        };
      } else {
        videoDecoderConfig = {
          codec: trueCodec, // Use the codec obtained from the video stream
          codedWidth: videoStream.codecpar.width,
          codedHeight: videoStream.codecpar.height,
        };
      }

      for (const keyFrame of selectedKeyframes) {
        await this.processBatch([keyFrame], videoDecoderConfig); // Process each keyframe individually
      }

      console.log("------------------");
      console.log("Frame Number = " + totalFrames);
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
      throw error;
    }
  }

  async processBatch(packets: any[], videoDecoderConfig: any) {
    console.log("PHASE1: Configuring video decoder");
    const framesData: any[] = [];
    const videoDecoder = new VideoDecoder({
      output: frame => {
        framesData.push(frame);
        console.log(`Frame ${framesData.length} received:`, frame);
        console.log("PHASE1.5: Decoding");
      },
      error: e => console.error('Error decoding frame:', e)
    });

    videoDecoder.configure(videoDecoderConfig);

    console.log("PHASE2: Decoding packets");
    console.log(`Total packets to decode: ${packets.length}`);

    for (const [index, pkt] of packets.entries()) {
      const chunk = new EncodedVideoChunk({
        type: pkt.flags & 1 ? 'key' : 'delta',
        timestamp: pkt.pts,
        data: new Uint8Array(pkt.data)
      });

      console.log(`Decoding packet at index ${index}, type: ${chunk.type}, timestamp: ${chunk.timestamp}`);
      this.fps.next(chunk.timestamp);

      try {
        await videoDecoder.decode(chunk);
      } catch (error) {
        console.error(`Failed to decode packet at index ${index}:`, error);
        // Stop processing this batch if the keyframe is missing
        if (chunk.type === 'key') break;
      }
    }

    await videoDecoder.flush();

    console.log(`Total number of decoded frames: ${framesData.length}`);
    this.videoFrames.next([...this.videoFrames.getValue(), ...framesData]);
  }

  private getCodecString(codecName: string): string {
    switch (codecName) {
      case 'h264':
        return 'avc1.42001E'; // Example for H.264 High Profile
      case 'vp8':
        return 'vp8';
      case 'vp9':
        return 'vp09.00.10.08';
      case 'hevc':
        return 'hev1';
      default:
        throw new Error(`Unsupported codec: ${codecName}`);
    }
  }

  private async extractExtradataUsingWebCodecs(libav: any, videoStream: any): Promise<Uint8Array | null> {
    const config = await LibAVWebCodecsBridge.videoStreamToConfig(libav, videoStream);
    if (config.description) {
      return new Uint8Array(config.description);
    }
    console.error('Extradata not found');
    return null;
  }
}
