import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// take Type from assets/libav...
declare var LibAV: any;
declare var LibAVWebCodecsBridge: any;

@Injectable({
  providedIn: 'root'
})
export class LibavInitService {

  // Setup initial data
  private videoName = new BehaviorSubject<string>("test2.mp4"); // video to test
  private customHeight = new BehaviorSubject<number>(150); // image height size
  private customWidth = new BehaviorSubject<number>(300); // image width size
  private maxKeyFrames = new BehaviorSubject<number>(240); // default keyframes value

  



  // Init empty data
  private videoFrames = new BehaviorSubject<any[]>([]);
  private framesNumber = new BehaviorSubject<number>(0);
  private fps = new BehaviorSubject<number>(0);
  private duration = new BehaviorSubject<number>(0);
  private codec = new BehaviorSubject<string>("");
  private loopNumber = new BehaviorSubject<number>(0);

  // Observable
  videoName$: Observable<string> = this.videoName.asObservable();
  videoFrames$: Observable<any[]> = this.videoFrames.asObservable();
  framesNumber$: Observable<number> = this.framesNumber.asObservable();
  customHeight$: Observable<number> = this.customHeight.asObservable();
  customWidth$: Observable<number> = this.customWidth.asObservable();
  duration$: Observable<number> = this.duration.asObservable();
  fps$: Observable<number> = this.fps.asObservable();
  codec$: Observable<string> = this.codec.asObservable();
  maxKeyFrames$: Observable<number> = this.maxKeyFrames.asObservable();
  loopNumber$: Observable<number> = this.loopNumber.asObservable();

  constructor() { }

  async initLibAV() {
    try {
      console.log("Starting Init...");
      console.time(" => FINAL TIME <= "); // All the process

      // Catch value to be usable in this func
      const videoName = this.videoName.getValue();
      const customHeight = this.customHeight.getValue();
      const customWidth = this.customWidth.getValue();
      
      const libav = await LibAV.LibAV();
      let videoDecoderConfig: any;

      console.log("Starting Fetch...");
      console.time(" => Temps de Fetch");

      // fetching = chercher
      const videoData = await fetch(`assets/video/${videoName}`)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
   
          return response.arrayBuffer();
        });

      console.timeEnd(" => Temps de Fetch");

      // Write data in the video
      console.log("Starting WriteFile...");
      console.time(" => Temps de WriteFile");
      await libav.writeFile(videoName, new Uint8Array(videoData));
      console.timeEnd(" => Temps de WriteFile");

      // Extract flux audio et video, get list of codec/types
      console.log("Starting Demux...");
      console.time(" => Demux");
      const [fmt_ctx, streams] = await libav.ff_init_demuxer_file(videoName);
      console.timeEnd(" => Demux");

      // Streams visualiser = canaux audio et video
      console.log(" =====> Streams lists : ", streams);

      // Catch the video stream, video > 0 usually
      let videoIdx = -1;
      for (let i = 0; i < streams.length; i++) {
        if (streams[i].codec_type === libav.AVMEDIA_TYPE_VIDEO) {
          videoIdx = i;
          break;
        }
      }
      if (videoIdx === -1) throw new Error("Video stream not found"); 

      // Canal video
      const videoStream = streams[videoIdx];

      console.log("Starting reading frames...");
      console.time(" => Reading frames");

      // Read many packet at once return packets ready to use and err/success msg
      // FIXME: libav ne semble pas pourvoir faire sa, mais peut etre le read deviendrais bcp plus rapide si
      // on lisait juste les paquets vidéo.
      const [result, packets] = await libav.ff_read_frame_multi(fmt_ctx, await libav.av_packet_alloc());


      if (result === libav.AVERROR_EOF) { // Detect if we have read the entire video
        console.log("End of file reached");
      }
      console.timeEnd(" => Reading frames");

      // Filter only video packets
      const videoPackets = packets[videoStream.index];

      // Count frames
      const totalFrames = videoPackets.length;
      this.framesNumber.next(totalFrames);

      // fps
      const truefps = totalFrames / videoStream.duration;
      this.fps.next(truefps);

      // max keyframe to display, 
      // i try to do proportional, ajust at your need
      // DELETE setupMaxKeyframes if u want manual value
      // and uncommente the lign below


      const maxKeyFrames = this.maxKeyFrames.getValue();

      // proportional
      //const maxKeyFrames = this.setupMaxKeyFrames(totalFrames, truefps)


      
    
      // Nbr de keyframes to display, regardless of file size, they
      // will be selected at regular intervals more or less large depending on the
      // file size, if < 40 keyframes, display all directly
      // if > 40, sort with the modulo of the keyframes
      const keyFrames = videoPackets.map((pkt: any, index: number) => ({ pkt, index }))
        .filter((item: any) => item.pkt.flags & 1);
      
      const modulo = Math.ceil(keyFrames.length / maxKeyFrames);
      const selectedKeyframes = keyFrames.filter((_: any, index: number) => index % modulo === 0).slice(0, maxKeyFrames);

      console.log("-----------------------------------------------------");
      console.log("Total number of KEYFRAMES in the video: ", keyFrames.length);
      console.log("Total number of FRAMES in the video: ", totalFrames);
      console.log("Total number of SELECTED KEYFRAMES in the video: ", selectedKeyframes.length);
      console.log("-----------------------------------------------------");

      console.log("Starting config...");
      console.time(" => Config");
      // Extract codec information to decode the video
      const codec = await libav.avcodec_get_name(videoStream.codec_id);
      this.codec.next(codec);

      // Launch getCodecString func to retrieve a usable string from the codec
      const trueCodec = this.getCodecString(codec);

      console.log(` =====> Codec: ${codec}, Codec String: ${trueCodec}`);

      // In the case of mp4, catch extradata to set up config
      if (codec == "h264" || codec == "h265") { // Add codecs here if mp4 tech evolves
        const extradata = await this.extractExtradataUsingWebCodecs(libav, videoStream); // TODO: test h265
        if (!extradata) {
          throw new Error('Extradata not found');
        }
        videoDecoderConfig = {
          codec: trueCodec,
          codedWidth: customWidth,
          codedHeight: customHeight,
          description: extradata
        };

        // If mp4 take good stream information
        // Calculate fps ?


      } else { // For webm no need for extradata to set up config
        videoDecoderConfig = {
          codec: trueCodec, // Use the codec obtained from the video stream
          codedWidth: videoStream.codecpar.width,
          codedHeight: videoStream.codecpar.height,
        };

        // If webm stream information is overall bad
        const truefps = 25; // set manuel cause webm is bad
        this.fps.next(truefps);
      }

      console.timeEnd(" => Config");

      console.log(" =====> Selected Keyframes List : ", selectedKeyframes);

      console.log("Starting Process Frames...");
      console.time(" => Process Frames & Draw");

      // Process each keyframe individually
      for (const keyFrame of selectedKeyframes) {
        await this.processKeyFrames([keyFrame.pkt], videoDecoderConfig, keyFrame.index);
      }

      console.log(" =====> Nombre total de keyframes Process et decode : ", this.loopNumber.getValue());
      console.timeEnd(" => Process Frames & Draw");

      console.log("------------------");
      console.timeEnd(" => FINAL TIME <= ");
      console.log("------------------");
      console.log("Fps = ", +this.fps.getValue());
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

  // permet de process et decode les keyframes selected, une par une.
  async processKeyFrames(packets: any[], videoDecoderConfig: any, frameNumber: number) { // Use frameNumber parameter
    const framesData: any[] = [];

    const videoDecoder = new VideoDecoder({
      output: frame => {
        framesData.push({ frame, frameNumber }); // Store the frame and its original frame number
        console.log(`Frame received, ready to be decoded :`, frame, frameNumber);
      },
      error: e => console.error('Error decoding frame:', e)
    });

    videoDecoder.configure(videoDecoderConfig);

    for (const [index, pkt] of packets.entries()) {
      const chunk = new EncodedVideoChunk({
        type: pkt.flags & 1 ? 'key' : 'delta',
        timestamp: pkt.pts,
        data: new Uint8Array(pkt.data)
      });

      try {
        await videoDecoder.decode(chunk);
      } catch (error) {
        console.error(`Failed to decode packet at index ${index}:`, error);
        if (chunk.type === 'key') break;
      }
    }

    await videoDecoder.flush();
    this.videoFrames.next([...this.videoFrames.getValue(), ...framesData]);

    const updatedLoopNumber = this.loopNumber.getValue() + 1;
    this.loopNumber.next(updatedLoopNumber);
    console.log(' =====> Nbr de KeyFrames Process et Decode:', updatedLoopNumber);
  }

  // permet de recupere une codec string utilisable par libav en fct du codec donne
  private getCodecString(codecName: string): string {
    switch (codecName) {
      case 'h264': // TODO: add sous version de h264
        return 'avc1.42001E'; // le plus commun pour mp4/h264, des cas particuliers existent
      case 'h265':
        return 'hev1.1.6.L120.90';
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

  // recupère les extradata mp4 avec wecodec bridge libav
  private async extractExtradataUsingWebCodecs(libav: any, videoStream: any): Promise<Uint8Array | null> {
    const config = await LibAVWebCodecsBridge.videoStreamToConfig(libav, videoStream);
    if (config.description) {
      return new Uint8Array(config.description);
    }
    console.error('Extradata not found');
    return null;
  }


  //FIXME: a proportional keyframe picker not working for everycase
  setupMaxKeyFrames(totalFrames: number, truefps: number): number {

    const videoDurationInSeconds = totalFrames / truefps;
    let newMaxKeyFrames: number;
    let videoDurationInMinutes: number;

    if (videoDurationInSeconds <= 120) { // inferieur a 2mn une img par 2.5s
      videoDurationInMinutes = videoDurationInSeconds / 5

    }
    else if (videoDurationInSeconds <= 240) { // inferieur a 4mn une img par 5s
      videoDurationInMinutes = videoDurationInSeconds / 10

    }
    else {
      videoDurationInMinutes = videoDurationInSeconds / 60; //une keyframe tt les 30s
    }
    newMaxKeyFrames = videoDurationInMinutes * 2; 
   
    this.maxKeyFrames.next(Math.ceil(newMaxKeyFrames));

    
    const maxKeyFrames = this.maxKeyFrames.getValue();
    return maxKeyFrames
  }

}