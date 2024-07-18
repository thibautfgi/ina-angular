import { Component } from '@angular/core';
import * as ffmpeg from 'fluent-ffmpeg';
import * as process from 'process';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  metadata: any = null;
  error: any = null;

  constructor() {
    process.env['FFMPEG_PATH'] = 'C:/Program Files/ffmpeg/bin/ffmpeg.exe';
    process.env['FFPROBE_PATH'] = 'C:/Program Files/ffmpeg/bin/ffprobe.exe';

    const inputFile = 'C:/Users/tibof/Desktop/Projet/Project B2/ina-angular/ffmcdur/src/assets/video/sample.webm';

    ffmpeg.ffprobe(inputFile, (err, metadata) => {
      if (err) {
        this.error = `Erreur lors de la lecture des métadonnées : ${err}`;
      } else {
        this.metadata = metadata;
      }
    });
  }
}
