import { Component, HostListener, ElementRef, ViewChild, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { Viewer } from '../../assets/models/viewers.class';
import { Video } from '../../assets/models/video.class';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-video-collection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './video-collection.component.html',
  styleUrl: './video-collection.component.scss'
})
export class VideoCollectionComponent {
  idViewer!: number;
  video: Video = new Video();
  selectedResolution: string = '';
  hideSettingsMenu: boolean = false;
  showSettingsMenu: boolean = false;
  showVideo: boolean = false;
  menuVisible: boolean = false;
  editMainContentIsActive: boolean = true;
  editViewerIsActive: boolean = false;
  validationContent: boolean = false;

  @ViewChild('videoContainer') videoContainer!: ElementRef;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(public dataService: DataService, private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  /**
  * Initializes the component, retrieves the viewer ID from the route, 
  * loads the user from local storage, and fetches viewer data.
  */
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.idViewer = +idParam;
      }
    });

    this.dataService.loadUserFromLocalStorage();
    this.getViewerData();

    this.loadVideo(10); // Beispiel-Video mit ID 10 abrufen
  }

  showMenu() {
    this.menuVisible = true;
  }

  hideMenu() {
    this.menuVisible = false;
  }

  backToMainPage() {
    this.router.navigate(['/video-collection', this.idViewer]);
  }

  editViewerOpen() {
    this.resetBooleanOfConten();
    this.dataService.viewername = this.dataService.singleViewer.viewername
    this.dataService.randomImgPath = String(this.dataService.singleViewer.picture_file);
    this.editViewerIsActive = true;

  }

  resetBooleanOfConten() {
    this.editMainContentIsActive = false;
    this.menuVisible = false;
    this.showVideo = false;
    this.editViewerIsActive = false;
  }

  /**
  * Fetches viewer data from the API and handles the response or errors.
  */
  async getViewerData() {
    try {
      const response = await fetch(`${this.dataService.API_BASE_URL}viewer/${this.idViewer}/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.dataService.user.token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        this.dataService.wrongData = errorData.detail || 'Fehler beim Abrufen der Daten.';
        return;
      }
      const responseData = await response.json();
      this.saveResponseDataViewerGet(responseData);
    } catch (error) {
      this.dataService.wrongData = 'Keine Daten erhalten.';
    }
  }

  /**
   * Processes the API response after saving a viewer and updates the viewer list.
   * Handles errors or resets to the viewer selection page on success.
   */
  saveResponseDataViewerGet(responseData: any) {
    if (responseData) {
      this.dataService.singleViewer = new Viewer(responseData);
    } else {
      this.dataService.wrongData = 'Keine Daten erhalten.';
    }
  }


  getVideo(videoId: number): Observable<Video> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.dataService.user.token}`
    });

    return this.http.get(`${this.dataService.API_BASE_URL}videos/single-video/${videoId}/`, { headers }).pipe(
      map(data => new Video(data)),
    );
  }

  loadVideo(videoId: number): void {
    this.getVideo(videoId).subscribe(video => {
      this.video = video;
      const resolveUrl = (path: string) => path.startsWith('http') ? path : `${this.dataService.API_VIDEO_URL}${path}`;

      this.selectedResolution =
        resolveUrl(video.video_480p) ||
        resolveUrl(video.video_720p) ||
        resolveUrl(video.video_1080p);
    }, error => {
      console.error('Fehler beim Laden des Videos:', error);
    });
  }



  changeResolution(url: string) {
    this.selectedResolution = url.startsWith('http')
      ? url
      : `${this.dataService.API_VIDEO_URL}${url}`;
    this.showSettingsMenu = false;
  }







  normalizeUrl(url: string): string {
    if (!url) return '';
    let normalizedUrl = url.trim().replace(/^https?:\/\//, '');
    if (normalizedUrl.startsWith('127.0.0.1:8000')) {
      normalizedUrl = normalizedUrl.replace(/^127.0.0.1:8000/, '');
    }
    return normalizedUrl.replace(/\/$/, '');
  }



  @HostListener('document:click', ['$event'])
  closeMenuOnClickOutside(event: Event) {
    if (!event.target || !(event.target as HTMLElement).closest('.settings-container')) {
      this.showSettingsMenu = false;
    }
  }

  toggleSettingsMenu() {
    this.showSettingsMenu = !this.showSettingsMenu;
  }

  hideControlsAfterDelay() {
    this.hideSettingsMenu = true;
  }

  showControls() {
    this.hideSettingsMenu = false;
  }

  hideControls() {
    if (!this.videoPlayer.nativeElement.paused) {
      this.hideSettingsMenu = true;
      if (this.showSettingsMenu) {
        this.toggleSettingsMenu();
      }

    }
  }

  validatioContentEditViewer() {
    this.validationContent = false;
    if (this.dataService.viewername !== '') {
      if (this.dataService.viewername !== this.dataService.singleViewer.viewername) {
        this.validationContent = true;
      }
    }
    if (this.dataService.randomImgPath !== this.dataService.singleViewer.picture_file) {
      this.validationContent = true;
    }

  }

  saveEditViewer() {
    console.log("    this.dataService.randomImgPath !==this.dataService.singleViewer.picture_file", this.dataService.randomImgPath !==
      this.dataService.singleViewer.picture_file)
    if (this.validationContent) {
      this.saveViewer();
      this.validationContent = false;
    }
  }

  /**
 * Edit viewer to the API and processes the response.
 * Handles errors with a default error message.
 */
  async saveViewer() {
    try {
      const response = await fetch(
        `${this.dataService.API_BASE_URL}viewer/${this.dataService.singleViewer.viewer_id}/`,
        {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.dataService.user.token}`,
          },
          body: JSON.stringify({ user: this.dataService.user.user, viewername: this.dataService.viewername, picture_file: this.dataService.randomImgPath }),
        }
      );
      this.saveResponseDataViewerPatch(response);
    } catch (error) {
      this.dataService.wrongData = 'Ein unbekannter Fehler ist aufgetreten';
    }
  }

  /**
* Processes the API response after saving a viewer and updates the viewer list.
* Handles errors or resets to the viewer selection page on success.
*/
  async saveResponseDataViewerPatch(response: Response) {
    const responseData: any = await response.json();
    if (!response.ok) {
      this.dataService.wrongData = responseData.detail;
      return;
    }
    if (responseData) {
      this.dataService.singleViewer = new Viewer(responseData);
      this.resetBooleanOfConten();
      this.editMainContentIsActive = true;
    } else {
      this.dataService.wrongData = 'Keine Daten erhalten.';
    }
  }
}


