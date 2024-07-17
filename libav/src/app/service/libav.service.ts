import { Injectable } from '@angular/core';
import LibAVJS from '@libav.js/variant-default';

@Injectable({
  providedIn: 'root'
})
export class LibavService {
  libav: any;

  constructor() {
    this.initializeLibav();
  }

  async initializeLibav() {
    this.libav = await LibAVJS.LibAV();
  }

  async processAudio() {
    if (!this.libav) {
      throw new Error('LibAV is not initialized');
    }

    await this.libav.writeFile('tmp.opus', new Uint8Array(
      await (await fetch('assets/exa.opus')).arrayBuffer()
    ));

    const [fmt_ctx, [stream]] = await this.libav.ff_init_demuxer_file('tmp.opus');
    const [, c, pkt, frame] = await this.libav.ff_init_decoder(stream.codec_id, stream.codecpar);
    const [, packets] = await this.libav.ff_read_multi(fmt_ctx, pkt);
    const frames = await this.libav.ff_decode_multi(c, pkt, frame, packets[stream.index], true);

    return frames.length;
  }
}
