import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { LibavInitService } from '../../services/libav-init.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [NgIf],
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.css']
})

export class FrameComponent {

}
