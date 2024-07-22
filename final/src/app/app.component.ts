import { Component, OnInit } from '@angular/core';
import * as LibAV from 'assets/libav/libav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  videoInfo = '';

  ngOnInit(): void {
    const libav = LibAV.LibAV();
    const videoData = new Uint8Array(/* your video data */);

    libav.writeFile('sample.mp4', videoData).then(() => {
      libav.ffprobe('sample.mp4', (err: any, stdout: string, stderr: any) => {
        if (err) {
          console.error('Error running ffprobe:', err);
          return;
        }

        this.videoInfo = stdout;
      });
    });
  }
}
