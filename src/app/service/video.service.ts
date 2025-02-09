import { Injectable } from '@angular/core';
import { DataService } from '../service/data.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Video } from '../../assets/models/video.class';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(public dataService: DataService, private http: HttpClient) { }



  /**
  * Retrieves a video by its ID with authorization headers.
  */
  getVideo(videoId: number): Observable<Video> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.dataService.user.token}`
    });
    return this.http.get(`${this.dataService.API_BASE_URL}videos/single-video/${videoId}/`, { headers }).pipe(
      map(data => new Video(data)),
    );
  }

  /**
  * Loads a video by its ID and sets the selected resolution.
  */
  loadVideo(videoId: number): void {
    this.switchContentOfVideo();
    this.getVideo(videoId).subscribe(video => {
      this.dataService.video = video;
      const resolveUrl = (path: string) => path.startsWith('http') ? path : `${this.dataService.API_VIDEO_URL}${path}`;
      this.dataService.selectedResolution =
        resolveUrl(video.video_480p) ||
        resolveUrl(video.video_720p) ||
        resolveUrl(video.video_1080p);
    }, error => {
      console.error('Fehler beim Laden des Videos:', error);
    });
  }

  /**
  * Switches the content to display the video.
  */
  switchContentOfVideo() {
    this.dataService.resetBooleanOfConten();
    this.dataService.showVideo = true;
  }
}
