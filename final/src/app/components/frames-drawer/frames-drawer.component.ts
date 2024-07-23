import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-frames-drawer',
  standalone: true,
  templateUrl: './frames-drawer.component.html',
  styleUrls: ['./frames-drawer.component.css']
})
export class FramesDrawerComponent implements OnInit {
  @Input() frame: any;
  @Input() index!: number;
  @Input() moduloNumber!: number;

  ngOnInit() {
    if (this.frame && this.frame.layout) {
      this.drawFrame();
    } else {
      console.error('Frame data is not valid:', this.frame);
    }
  }

  drawFrame() {
    const displayFrame = this.frame; // directly using the passed frame

    if (!displayFrame) {
      console.error('Frame data is undefined or null:', displayFrame);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = displayFrame.width;
    canvas.height = displayFrame.height;

    const yPlane = displayFrame.data.subarray(displayFrame.layout[0].offset, displayFrame.layout[0].offset + displayFrame.layout[0].stride * displayFrame.height);
    const uPlane = displayFrame.data.subarray(displayFrame.layout[1].offset, displayFrame.layout[1].offset + displayFrame.layout[1].stride * (displayFrame.height / 2));
    const vPlane = displayFrame.data.subarray(displayFrame.layout[2].offset, displayFrame.layout[2].offset + displayFrame.layout[2].stride * (displayFrame.height / 2));

    const imgData = ctx.createImageData(displayFrame.width, displayFrame.height);
    for (let y = 0; y < displayFrame.height; y++) {
      for (let x = 0; x < displayFrame.width; x++) {
        const yIndex = y * displayFrame.layout[0].stride + x;
        const uIndex = Math.floor(y / 2) * displayFrame.layout[1].stride + Math.floor(x / 2);
        const vIndex = Math.floor(y / 2) * displayFrame.layout[2].stride + Math.floor(x / 2);

        const Y = yPlane[yIndex];
        const U = uPlane[uIndex] - 128;
        const V = vPlane[vIndex] - 128;

        const R = Y + 1.402 * V;
        const G = Y - 0.344 * U - 0.714 * V;
        const B = Y + 1.772 * U;

        const imgIndex = y * displayFrame.width + x;
        imgData.data[imgIndex * 4] = R;
        imgData.data[imgIndex * 4 + 1] = G;
        imgData.data[imgIndex * 4 + 2] = B;
        imgData.data[imgIndex * 4 + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    const container = document.getElementById(`frame-${this.index}`);
    if (container) {
      container.appendChild(canvas);
    }
  }
}
