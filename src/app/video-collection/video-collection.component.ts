import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../service/data.service';
import { Viewer } from '../../assets/models/viewers.class';

@Component({
  selector: 'app-video-collection',
  standalone: true,
  imports: [],
  templateUrl: './video-collection.component.html',
  styleUrl: './video-collection.component.scss'
})
export class VideoCollectionComponent {
  idViewer!: number;

  constructor(public dataService: DataService, private route: ActivatedRoute) { }

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
    console.log(responseData)
    if (responseData) {
      this.dataService.singleViewer = new Viewer(responseData);
      console.log("!!!!!!!!!!!!!!", this.dataService.user, this.dataService.singleViewer)
    } else {
      this.dataService.wrongData = 'Keine Daten erhalten.';
    }
  }
}
