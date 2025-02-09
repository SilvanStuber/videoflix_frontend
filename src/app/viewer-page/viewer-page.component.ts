import { Component } from '@angular/core';
import { DataService } from '../service/data.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Viewer } from '../../assets/models/viewers.class';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-viewer-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './viewer-page.component.html',
  styleUrl: './viewer-page.component.scss'

})
export class ViewerPageComponent {
  viewerSelectPageActive: boolean = true;
  addViewerPageActive: boolean = false;

  constructor(public dataService: DataService, public apiService: ApiService, private router: Router) { }

  /**
  * Initializes the component by loading login data.
  */
  ngOnInit() {
    this.dataService.loadUserFromLocalStorage()
    this.apiService.loadViewerOnApi();
  }

  /**
  * Activates the add viewer page and sets a random image path.
  * Deactivates the viewer selection page.
  */
  addViewer() {
    this.dataService.setRandomImagePath();
    this.viewerSelectPageActive = false;
    this.addViewerPageActive = true;
  }

  /**
  * Resets viewer-related fields and activates the viewer selection page.
  * Deactivates the add viewer page.
  */
  backToSelectViewer() {
    this.dataService.randomImgPath = '';
    this.dataService.viewername = '';
    this.addViewerPageActive = false;
    this.viewerSelectPageActive = true;
  }

  /**
  * Sends a new viewer to the API and processes the response.
  * Handles errors with a default error message.
  */
  async saveViewer() {
    try {
      const response = await fetch(
        `${this.dataService.API_BASE_URL}viewer/`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.dataService.user.token}`,
          },
          body: JSON.stringify({ user: this.dataService.user.user, viewername: this.dataService.viewername, picture_file: this.dataService.randomImgPath }),
        }
      );
      this.saveResponseDataViewerPost(response);
    } catch (error) {
      this.dataService.wrongData = 'Ein unbekannter Fehler ist aufgetreten';
    }
  }

  /**
  * Processes the API response after saving a viewer and updates the viewer list.
  * Handles errors or resets to the viewer selection page on success.
  */
  async saveResponseDataViewerPost(response: Response) {
    const responseData: any = await response.json();
    if (!response.ok) {
      this.dataService.wrongData = responseData.error;
      return;
    }
    if (responseData && Array.isArray(responseData)) {
      this.dataService.viewers = responseData.map((viewer: any) => new Viewer(viewer));
      this.backToSelectViewer();
    } else {
      this.dataService.wrongData = 'Keine Daten erhalten.';
    }
  }

  /**
   * Navigates to the video collection page for a specific viewer.
   * @param {Number} idViewer - The ID of the viewer.
   */
  loadVideoCollection(idViewer: Number) { /* TODO GO TO video-collection */
    this.router.navigate(['/video-collection', idViewer]);
  }
}

