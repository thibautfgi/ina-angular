import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// take Type from assets/libav...
declare var LibAV: any;
declare var LibAVWebCodecsBridge: any;

@Injectable({
  providedIn: 'root'
})
export class LibavInitService {



  // Setup there initial data
  private videoName = new BehaviorSubject<string>("test1.mp4"); // video to test
  private customHeight = new BehaviorSubject<number>(150); // image height size
  private customWidth = new BehaviorSubject<number>(300); // image width size
  private maxKeyFrames = new BehaviorSubject<number>(40); // image width size

  //  Init empty data
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

      console.log("Starting Init...") 
      console.time("Temps Init"); // All the process

      // catch value to be usable in this func
      const videoName = this.videoName.getValue();
      const customHeight = this.customHeight.getValue();
      const customWidth = this.customWidth.getValue();
      const maxKeyFrames = this.maxKeyFrames.getValue();
      const libav = await LibAV.LibAV();
      let videoDecoderConfig: any;

      console.log("Starting Fetch...");
      console.time(" => Temps de Fetch");

      //fetching = chercher
      const videoData = await fetch(`assets/video/${videoName}`)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          console.timeEnd(" => Temps de Fetch");
          return response.arrayBuffer();
        });

      // write data in the video

      console.log("Starting WriteFile...");
      console.time(" => Temps de WriteFile");
      await libav.writeFile(videoName, new Uint8Array(videoData));
      console.timeEnd(" => Temps de WriteFile");

      // etrait flux audio et video, get list of codec/types
      console.log("Starting Demux...");
      console.time(" => Demux");
      const [fmt_ctx, streams] = await libav.ff_init_demuxer_file(videoName);
      console.timeEnd(" => Demux");

      // les streams visualiser = canaux audio et video
      console.log(" =====> Streams lists : ", streams);

      // catch the video stream, video > 0 usualy
      let videoIdx = -1;
      for (let i = 0; i < streams.length; i++) {
        if (streams[i].codec_type === libav.AVMEDIA_TYPE_VIDEO) {
          videoIdx = i;
          break;
        }
      }
      if (videoIdx === -1) throw new Error("Video stream not found");

      // le canal video
      const videoStream = streams[videoIdx];

      console.log("Starting reading frames...");
      console.time(" => Reading frames");

      // read many packet at once return packets ready to use and err/succes msg
      const [result, packets] = await libav.ff_read_frame_multi(fmt_ctx, await libav.av_packet_alloc());

      if (result === libav.AVERROR_EOF) { //detecte si on a bien lus tt la video
        console.log("End of file reached");
      }
      console.timeEnd(" => Reading frames");
    

      //compte les frames
      const totalFrames = packets[videoStream.index].length;
      this.framesNumber.next(totalFrames);

      // le nbr de keyframes a afficher, peut importe la taille du fichier, elle
      // seront selectionner a interval regulier plus ou moins grd en fonction de la
      // taille du fichier, si - de 40 keyframes, tt afficher directement
      // si +de 40, trie avec le modulo des keyframes
      const keyFrames = packets[videoStream.index].filter((pkt: any) => pkt.flags & 1);
      const modulo = Math.ceil(keyFrames.length / maxKeyFrames);
      const selectedKeyframes = keyFrames.filter((_: any, index: number) => index % modulo === 0).slice(0, maxKeyFrames);


      console.log("-----------------------------------------------------");
      console.log("Total number of KEYFRAMES in the video: ", keyFrames.length);
      console.log("Total number of FRAMES in the video: ", totalFrames);
      console.log("Total number of SELECTED KEYFRAMES in the video: ", selectedKeyframes.length);
      console.log("-----------------------------------------------------");



      console.log("Starting config...")
      console.time(" => Config");
      // Extract codec information, pour decode la video
      const codec = await libav.avcodec_get_name(videoStream.codec_id);
      this.codec.next(codec); 

      //lance getCodecString func pour recuperer une string utilisable du codec
      const trueCodec = this.getCodecString(codec);

      console.log(` =====> Codec: ${codec}, Codec String: ${trueCodec}`);

       // dans le cas mp4, catch les extradata pour setup config
      if (codec == "h264" || codec == "h265") { // ajoute des codecs ici si la tech mp4 evolue
        const extradata = await this.extractExtradataUsingWebCodecs(libav, videoStream); // TODO: test h265
        if (!extradata) {
          throw new Error('Extradata not found');
        }
        videoDecoderConfig = {
          codec: trueCodec,
          codedWidth: videoStream.codecpar.width,
          codedHeight: videoStream.codecpar.height,
          description: extradata
        };
        // if mp4 take good stream information

        // Calculate fps
        const truefps = totalFrames / videoStream.duration;
      
        this.fps.next(truefps)
        console.log(this.fps.getValue())



      } else { // cas webm pas besoin d'extradata pour setup config
        videoDecoderConfig = {
          codec: trueCodec, // Use the codec obtained from the video stream
          codedWidth: videoStream.codecpar.width,
          codedHeight: videoStream.codecpar.height,
        };


        // if webm stream information are overall bad

      }

      console.timeEnd(" => Config");

      console.log(" =====> Selected Keyframes List : ", selectedKeyframes)

      console.log("Starting Process Frames...")
      console.time(" => Process Frames & Draw")

      // Process each keyframe individually
      for (const keyFrame of selectedKeyframes) {
        await this.processKeyFrames([keyFrame], videoDecoderConfig);
      }

      console.log(" =====> Nombre total de keyframes Process et decode : ", this.loopNumber.getValue())
      console.timeEnd(" => Process Frames & Draw")




      console.log("------------------");
      console.timeEnd("Temps Init");
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
  async processKeyFrames(packets: any[], videoDecoderConfig: any) {

  //
    const framesData: any[] = [];
    // si une frame a ete decode avec succes, elle est output
    const videoDecoder = new VideoDecoder({
      output: frame => {
        framesData.push(frame);
        console.log(`Frame received, ready to be decode :`, frame);
      },
      error: e => console.error('Error decoding frame:', e)
    });

    // config le decoder avec code, taille, extradata...
    videoDecoder.configure(videoDecoderConfig);

    // cree un encoded video chunck(troncons) avec tt les infos necessaire a chaque frames
    for (const [index, pkt] of packets.entries()) {
      const chunk = new EncodedVideoChunk({
        type: pkt.flags & 1 ? 'key' : 'delta',
        timestamp: pkt.pts,
        data: new Uint8Array(pkt.data)
      });

      try {
        await videoDecoder.decode(chunk); // decode le chunk
      } catch (error) {
        console.error(`Failed to decode packet at index ${index}:`, error);
        // Stop processing this batch if the keyframe is missing
        if (chunk.type === 'key') break;
      }
    }

    // envoie les data en process
    await videoDecoder.flush(); // verifie que tt les frames envoye ds le decode son bien process
    this.videoFrames.next([...this.videoFrames.getValue(), ...framesData]);


    // tiens en compte le nbr de frames process
    const updatedLoopNumber = this.loopNumber.getValue() + 1;
    this.loopNumber.next(updatedLoopNumber);
    console.log(' =====> Nbr de KeyFrames Process et Decode:', updatedLoopNumber);

  }


  // permet de recupere une codec string utilisable par libav en fct du codec donne
  private getCodecString(codecName: string): string {
    switch (codecName) {
      case 'h264':
        return 'avc1.42001E'; // le plus communs pour mp4/h264, des cas particuliers existe 
        //TODO: gerer les cas particulier de variante moins connue de h264
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
}
