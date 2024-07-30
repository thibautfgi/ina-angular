libavjs-webcodecs-bridge has two directions of use: demuxing and muxing. The
demuxing functions are designed to aid when using libav.js for demuxing and
WebCodecs for decoding. The muxing functions are designed to aid when using
WebCodecs for encoding and libav.js for muxing. In either case, it's a BYOL
(bring your own library) system: you must provide your own instance of libav.js,
and if WebCodecs isn't built into your browser, you must bring a polyfill
(presumably libavjs-webcodecs-polyfill).


## Demuxing

If you are demuxing in libav.js, you will have a libav.js `Stream` object for
each stream, and libav.js `Packet` objects for each packet in the file. Convert
the `Stream` object to a configuration to configure a WebCodecs decoder, and
convert each `Packet` to an encoded chunk to be decoded in WebCodecs.

### `audioStreamToConfig`, `videoStreamToConfig`

```js
async function audioStreamToConfig(
    libav: LibAVJS.LibAV, stream: LibAVJS.Stream
): Promise<LibAVJSWebCodecs.AudioDecoderConfig>;

async function videoStreamToConfig(
    libav: LibAVJS.LibAV, stream: LibAVJS.Stream
): Promise<LibAVJSWebCodecs.VideoDecoderConfig>;
```

libav.js `Stream`s can be converted to WebCodecs configurations, to be passed to
`AudioDecoder.configure` or `VideoDecoder.configure`. You must determine whether
you have an audio or video stream yourself, by checking `stream.codec_type`.

To convert an audio stream to a suitable configuration, use
`await audioStreamToConfig(libav, stream)`. Use `videoStreamToConfig` for video
streams. These functions will *always* return something, regardless of whether
WebCodecs actually supports the codec in question, so make sure to check whether
the configuration is actually supported.

### `packetToEncodedAudioChunk`, `packetToEncodedVideoChunk`

```js
function packetToEncodedAudioChunk(
    packet: LibAVJS.Packet, stream: LibAVJS.Stream, opts: {
        EncodedAudioChunk?: any
    } = {}
): LibAVJSWebCodecs.EncodedAudioChunk;

function packetToEncodedVideoChunk(
    packet: LibAVJS.Packet, stream: LibAVJS.Stream, opts: {
        EncodedVideoChunk?: any
    } = {}
): LibAVJSWebCodecs.EncodedVideoChunk;
```

libav.js `Packet`s can be converted to WebCodecs `EncodedAudioChunk`s or
`EncodedVideoChunk`s.

To convert an audio packet to an `EncodedAudioChunk`, use
`packetToEncodedAudioChunk(packet, stream)`. Use `packetToEncodedVideoChunk` for
video packets. Note that these functions are synchronous.

If you're using a polyfill, you can pass the `EncodedAudioChunk` or
`EncodedVideoChunk` constructor as the appropriate field of the third (`opts`)
argument.

Note that FFmpeg (and thus libav.js) and WebCodecs disagree on the definition of
keyframe with both H.264 and H.265. WebCodecs requires a non-recovery frame,
i.e., a keyframe with no B-frames, whereas FFmpeg takes the keyframe status from
the container, and all container formats mark recovery frames as keyframes
(because they are keyframes). No implementation of WebCodecs actually cares
whether you mark a frame as a keyframe or a delta frame *except* for the first
frame sent to the decoder. The consequence of this is that if you seek to the
middle of an H.264 or H.265 file and read a frame that libav.js indicates is a
keyframe, you may not actually be able to start decoding with that frame. There
is no practical way to fix this on the libavjs-webcodecs-bridge side, because
FFmpeg offers no API to distinguish these frame types; it would be necessary to
manually parse frame data instead. See [issue
3](https://github.com/Yahweasel/libavjs-webcodecs-bridge/issues/3) for some
suggested workarounds.


## Muxing

If you are encoding with WebCodecs, you will have a WebCodecs configuration, and
a stream of `EncodedAudioChunk`s or `EncodedVideoChunk`s. Convert the
configuration to a stream configuration used in libav.js's `ff_init_muxer`, and
the encoded chunks to libav.js `Packet`s.

### `configToAudioStream`, `configToVideoStream`

```js
async function configToAudioStream(
    libav: LibAVJS.LibAV, config: LibAVJSWebCodecs.AudioEncoderConfig
): Promise<[number, number, number]>;

async function configToVideoStream(
    libav: LibAVJS.LibAV, config: LibAVJSWebCodecs.VideoEncoderConfig
): Promise<[number, number, number]>;
```

Configurations for audio or video encoders in WebCodecs can be converted to
stream information sufficient for `ff_init_muxer`. Note that `ff_init_muxer`
expects three pieces of information for each stream: a pointer to stream
information (in this case, `AVCodecParameters`), and the numerator and
denominator of the timebase used. Thus, these functions return those three
numbers, in the array demanded by `ff_init_muxer`.

To convert an audio configuration to a suitable stream, use
`await configToAudioStream(libav, config)`. Use `configToVideoStream` for video
streams. These functions will *always* return something, regardless of whether
the codec is recognized or libav.js supports it, so make sure to check whether
`ff_init_muxer` actually succeeds.

Two things of note about this function:
 - These return `AVCodecParameters`, so you must set the `codecpars`
option to `true` when calling `ff_init_muxer`.
 - Because of differences between libav.js and WebCodecs, you must convert at
   least one chunk from each stream to a packet *before* starting the muxer.
   This is because of codec parameters that are only passed with the first
   encoded chunk. `demo/demo.js` demonstrates this.

### `encodedAudioChunkToPacket`, `encodedVideoChunkToPacket`

```js
async function encodedAudioChunkToPacket(
    libav: LibAVJS.LibAV, chunk: LibAVJSWebCodecs.EncodedAudioChunk, metadata: any,
    stream: [number, number, number], streamIndex: number
): Promise<LibAVJS.Packet>;

async function encodedVideoChunkToPacket(
    libav: LibAVJS.LibAV, chunk: LibAVJSWebCodecs.EncodedVideoChunk, metadata: any,
    stream: [number, number, number], streamIndex: number
): Promise<LibAVJS.Packet>;
```

WebCodecs encoded chunks (`EncodedAudioChunk`s and `EncodedVideoChunk`s) can be
converted to libav.js `Packet`s, for use in `ff_write_multi`.

To convert an audio chunk to a libav.js packet, use
`encodedAudioChunkToPacket(libav, chunk, metadata, stream, streamIndex)`.
`libav` is the libav.js instance in use, `chunk` is the encoded chunk,
`metadata` is the metadata sent with the chunk, `stream` is the stream
information returned by `configToAudioStream`, and `streamIndex` is the index of
the stream in your call to `ff_init_muxer`. Use `encodedVideoChunkToPacket` for
video chunks. Note that these functions are asynchronous, unlike their demuxing
counterparts.

Due to differences in how libav and WebCodecs handle extra data for codecs, *you
must convert at least one packet from each stream before initializing the
muxer*. These functions convert the packet, but also initialize the extra codec
data (because in WebCodecs it's sent with the first packet), and that extra
codec data must be initialized before the muxer. This can make the ordering of
tasks a bit awkward, but is unavoidable. You may want to look at the demo in
`demo/` for an example of the correct ordering of steps.
