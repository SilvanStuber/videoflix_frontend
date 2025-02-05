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
import { User } from '../../assets/models/user.class';
import { ApiService } from '../service/api.service';
@Component({
  selector: 'app-video-collection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './video-collection.component.html',
  styleUrl: './video-collection.component.scss'
})
export class VideoCollectionComponent {



  @ViewChild('videoContainer') videoContainer!: ElementRef;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(public dataService: DataService, public apiService: ApiService, private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  /**
  * Initializes the component, retrieves the viewer ID from the route, 
  * loads the user from local storage, and fetches viewer data.
  */
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.dataService.idViewer = +idParam;
      }
    });
    this.dataService.loadUserFromLocalStorage();
    this.apiService.getViewerData();
    this.loadVideo(10);
  }

  showMenu() {
    this.dataService.menuVisible = true;
  }

  hideMenu() {
    this.dataService.menuVisible = false;
  }

  backToMainPage() {
    this.router.navigate(['/video-collection', this.dataService.idViewer]);
  }

  editViewerOpen() {
    this.dataService.resetBooleanOfConten();
    this.dataService.viewername = this.dataService.singleViewer.viewername
    this.dataService.randomImgPath = String(this.dataService.singleViewer.picture_file);
    this.dataService.editViewerIsActive = true;

  }

  editUserOpen() {
    this.dataService.resetBooleanOfConten();
    this.dataService.editUserIsActive = true;
  }

  switchViewer() {
    this.dataService.resetBooleanOfConten();
    this.dataService.mainContentIsActive = true;
    this.dataService.loadViwerPage()
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



  changeResolution(url: string) {
    this.dataService.selectedResolution = url.startsWith('http')
      ? url
      : `${this.dataService.API_VIDEO_URL}${url}`;
    this.dataService.showSettingsMenu = false;
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
      this.dataService.showSettingsMenu = false;
    }
  }

  toggleSettingsMenu() {
    this.dataService.showSettingsMenu = !this.dataService.showSettingsMenu;
  }

  hideControlsAfterDelay() {
    this.dataService.hideSettingsMenu = true;
  }

  showControls() {
    this.dataService.hideSettingsMenu = false;
  }

  hideControls() {
    if (!this.videoPlayer.nativeElement.paused) {
      this.dataService.hideSettingsMenu = true;
      if (this.dataService.showSettingsMenu) {
        this.toggleSettingsMenu();
      }

    }
  }

  validatioContentEditViewer() {
    this.dataService.validationContent = false;
    if (this.dataService.viewername !== '') {
      if (this.dataService.viewername !== this.dataService.singleViewer.viewername) {
        this.dataService.validationContent = true;
      }
    }
    if (this.dataService.randomImgPath !== this.dataService.singleViewer.picture_file) {
      this.dataService.validationContent = true;
    }

  }

  openEditeInputUsername() {
    this.dataService.closeEditeInput();
    this.dataService.inputUserEditIsActive = true;
  }

  openEditeInputEmail() {
    this.dataService.closeEditeInput();
    this.dataService.inputEmailEditIsActive = true;
  }




  validatioContentEditUser() {
    this.dataService.validationContentUser = false;
    if (this.dataService.userName !== '') {
      if (this.dataService.userName !== this.dataService.user.username) {
        this.dataService.validationContentUser = true;
      }
    }
    if (this.dataService.email !== '') {
      if (this.dataService.email !== this.dataService.user.email) {
        this.dataService.validationContentUser = true;
      }
    }
  }

  saveEditUser() {
    if (this.dataService.validationContentUser) {
      if (this.dataService.userName === '') {
        this.dataService.userName = this.dataService.user.username;
      }
      if (this.dataService.email === '') {
        this.dataService.email = this.dataService.user.email;
      }
      this.apiService.saveEditeUserOnAPI();
    }
  }




  saveEditViewer() {
    if (this.dataService.validationContent) {
      this.apiService.saveViewer();
      this.dataService.validationContent = false;
    }
  }


}

