import { Component } from '@angular/core';
var ffmpeg = require('ffmpeg');

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent {
  isLoaded = false;
  myFiles: string[] = [];
  progress:number=0;
  doneupload=false;

  constructor()
  {
    
  }

  getFileDetails(e) {      
    
    //console.log (e.target.files);   
    this.myFiles=[]   
    for (var i = 0; i < e.target.files.length; i++) {      
      this.myFiles.push(e.target.files[i]);      
    }      
    // const file = (e.target as HTMLInputElement).files[0]
    // const form = new FormData();
    // form.append("Upload",file);  

    try {
	var process = new ffmpeg(e.target.files[0].filename);
	process.then(function (video: any) {
		console.log('The video is ready to be processed');
	}, function (err: string) {
		console.log('Error: ' + err);
	});
} catch (err) {
	console.log(e.code);
	console.log(e.msg);
}
  }

}