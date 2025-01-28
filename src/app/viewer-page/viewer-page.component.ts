import { Component } from '@angular/core';
import { DataService } from '../service/data.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Viewer } from '../../assets/models/viewers.class';

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
  randomImgPath: String = '';
  availableImages = [
    "/assets/img/avatar-1.png",
    "/assets/img/avatar-2.png",
    "/assets/img/avatar-3.png",
    "/assets/img/avatar-4.jpg",
    "/assets/img/avatar-5.jpg",
    "/assets/img/avatar-6.png",
    "/assets/img/avatar-7.jpg",
    "/assets/img/avatar-8.jpg",
    "/assets/img/avatar-9.jpg",
    "/assets/img/avatar-10.jpg"
  ];
  viewername: String = '';
  emptyViewername: Boolean = false;
  inputIsEmty: Boolean = true;

  constructor(public dataService: DataService, private router: Router) { }

  /**
  * Initializes the component by loading login data.
  */
  ngOnInit() {
    this.dataService.loadUserFromLocalStorage()
    this.loadViewerOnApi();
  }

  /**
  * Loads viewer data from the API and saves the response.
  * Handles errors by setting a default error message.
  */
  async loadViewerOnApi() {
    try {
      const response = await fetch(
        `${this.dataService.API_BASE_URL}viewer/?user=${this.dataService.user.user}`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.dataService.user.token}`,
          },
        }
      );
      this.saveDataLoadViewer(response);
    } catch (error) {
      this.dataService.wrongData = 'Ein unbekannter Fehler ist aufgetreten';
    }
  }

  /**
  * Processes the API response, saves viewer data, or sets an error message.
  * Converts valid response data into Viewer objects.
  */
  async saveDataLoadViewer(response: Response) {
    const responseData: any = await response.json();
    if (!response.ok) {
      this.dataService.wrongData = responseData.detail;
      return;
    }
    if (responseData && Array.isArray(responseData)) {
      this.dataService.viewers = responseData.map((viewer: any) => new Viewer(viewer));
    } else {
      this.dataService.wrongData = 'Keine Daten erhalten.';
    }
  }

  /**
  * Activates the add viewer page and sets a random image path.
  * Deactivates the viewer selection page.
  */
  addViewer() {
    this.setRandomImagePath();
    this.viewerSelectPageActive = false;
    this.addViewerPageActive = true;
  }

  /**
  * Resets viewer-related fields and activates the viewer selection page.
  * Deactivates the add viewer page.
  */
  backToSelectViewer() {
    this.randomImgPath = '';
    this.viewername = '';
    this.addViewerPageActive = false;
    this.viewerSelectPageActive = true;
  }

  /**
  * Sets a random image path from available images, excluding used ones.
  * Removes assigned images from the available list.
  */
  setRandomImagePath() {
    if (this.dataService.viewers && Array.isArray(this.dataService.viewers)) {
      this.dataService.viewers.forEach(viewer => {
        if (viewer.picture_file && this.availableImages.includes(viewer.picture_file)) {
          const index = this.availableImages.indexOf(viewer.picture_file);
          if (index !== -1) {
            this.availableImages.splice(index, 1);
          }
        }
      });
    }
    const randomIndex = Math.floor(Math.random() * this.availableImages.length);
    this.randomImgPath = this.availableImages[randomIndex];
  }

  /**
  * Resets viewer name error states based on the input value.
  * Updates flags for empty input validation.
  */
  resetErrorViewername() {
    if (this.viewername !== '') {
      this.emptyViewername = false;
      this.inputIsEmty = false;
    } else {
      this.emptyViewername = true;
      this.inputIsEmty = true;
    }
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
          body: JSON.stringify({ user: this.dataService.user.user, viewername: this.viewername, picture_file: this.randomImgPath }),
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
      this.dataService.wrongData = responseData.detail;
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

