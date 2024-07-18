// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { VideoComponent } from './app/components/video/video.component';

bootstrapApplication(VideoComponent, {
  providers: [
    { provide: 'API_URL', useValue: 'http://localhost:3000' },
    provideHttpClient()
  ]
})
  .catch(err => console.error(err));
