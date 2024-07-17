import { Component } from '@angular/core';
import { LibavService } from '../../service/libav.service';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.css'
})
export class FrameComponent {


  constructor(private libavService: LibavService) {}

  async ngOnInit() {
    try {
      const frameCount = await this.libavService.processAudio();
      alert(`Got ${frameCount} audio frames!`);
    } catch (error) {
      console.error('Error processing audio', error);
    }
  }


}
