import { Component } from '@angular/core';
import { DataService } from '../service/data.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Viewer } from '../../assets/models/viewers.class';

@Component({
  selector: 'app-viewer-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viewer-page.component.html',
  styleUrl: './viewer-page.component.scss'

})
export class ViewerPageComponent {
  viewerSelectPageActive: boolean = true;
  addViewerPageActive: boolean = false;
  randomImgPath: String = '';

  constructor(public dataService: DataService, private router: Router) { }

  /**
  * Initializes the component by loading login data.
  */
  ngOnInit() {
    this.dataService.loadUserFromLocalStorage()
    this.loadViewerOnApi();
  }


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
    } catch (error) {
      this.dataService.wrongData = 'Ein unbekannter Fehler ist aufgetreten';
    }
  }

  addViewer() {
    this.setRandomImagePath();
    this.viewerSelectPageActive = false;
    this.addViewerPageActive = true;
  }

  setRandomImagePath() {
    const availableImages = [
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
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    this.randomImgPath = availableImages[randomIndex];
  }

}
