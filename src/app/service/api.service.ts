import { Injectable } from '@angular/core';
import { DataService } from '../service/data.service';
import { Viewer } from '../../assets/models/viewers.class';
import { User } from '../../assets/models/user.class';
import { Video } from '../../assets/models/video.class';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public dataService: DataService) { }

  /**
  * Sends a login request to the API and processes the response.
  */
  async loginOnApi() {
    try {
      const response = await fetch(`${this.dataService.API_BASE_URL}login/`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_or_email: this.dataService.emailOrUsername, password: this.dataService.password }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        this.dataService.wrongData = responseData.detail;
        return
      }
      if (responseData && responseData.token) {
        this.dataService.user = new User(responseData);
        this.dataService.saveUserToLocalStorage();
      } else {
        this.dataService.wrongData = responseData.detail;
      }
      if (this.dataService.user.token) {
        this.dataService.loadViwerPage();
      }
    } catch (error) {
      this.dataService.wrongData = 'Ein unbekannter Fehler ist aufgetreten';
    }
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
      this.dataService.wrongData = responseData.error;
      return;
    }
    if (responseData && Array.isArray(responseData)) {
      this.dataService.viewers = responseData.map((viewer: any) => new Viewer(viewer));
    } else {
      this.dataService.wrongData = 'Keine Daten erhalten.';
    }
  }

  /**
  * Sends a new password to the API for reset confirmation.
  */
  async setNewPasswordOnApi() {
    try {
      const response = await fetch(`${this.dataService.API_BASE_URL}authentication/password_reset_confirm/${this.dataService.uid}/${this.dataService.token}/`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: this.dataService.password, repeated_password: this.dataService.repeatedPassword }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        this.dataService.wrongData = responseData.detail;
      } else {
        this.dataService.loadMainPage()
      }
    } catch (error) {
      this.dataService.wrongData = 'Ein unbekannter Fehler ist aufgetreten';
    }
  }

  /**
  * Saves the edited user data to the API using a PATCH request.
  */
  async saveEditeUserOnAPI() {
    try {
      const response = await fetch(
        `${this.dataService.API_BASE_URL}profile/${this.dataService.user.user}/`,
        {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.dataService.user.token}`,
          },
          body: JSON.stringify({ username: this.dataService.userName, email: this.dataService.email }),
        }
      );
      this.saveResponseDataUserPatch(response);
    } catch (error) {
      this.dataService.wrongData = 'Ein unbekannter Fehler ist aufgetreten';
    }
  }

  /**
  * Processes the API response after saving a viewer and updates the viewer list.
  * Handles errors or resets to the viewer selection page on success.
  */
  async saveResponseDataUserPatch(response: Response) {
    const responseData: any = await response.json();
    if (!response.ok) {
      this.dataService.wrongData = responseData.error;
      return;
    }
    if (responseData) {
      this.dataService.user = new User(responseData);
      this.dataService.saveUserToLocalStorage();
      this.dataService.closeEditeInput()
    } else {
      this.dataService.wrongData = 'Keine Daten erhalten.';
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
  */
  async saveResponseDataViewerPatch(response: Response) {
    const responseData: any = await response.json();
    if (!response.ok) {
      this.dataService.wrongData = responseData.error;
      ;
      return;
    }
    if (responseData) {
      this.dataService.singleViewer = new Viewer(responseData);
      this.dataService.resetBooleanOfConten();
      this.dataService.mainContentIsActive = true;
    } else {
      this.dataService.wrongData = 'Keine Daten erhalten.';
    }
  }

  /**
  * Fetches viewer data from the API and handles the response or errors.
  */
  async getViewerData() {
    try {
      const response = await fetch(`${this.dataService.API_BASE_URL}viewer/${this.dataService.idViewer}/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.dataService.user.token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        this.dataService.wrongData = errorData.error || 'Fehler beim Abrufen der Daten.';
        return;
      }
      const responseData = await response.json();
      this.saveResponseDataViewerGet(responseData);
    } catch (error) {
      this.dataService.wrongData = 'Keine Daten erhalten.';
    }
  }

  /**
  * Fetches video data from the API and handles the response or errors.
  */
  async getVideoData() {
    try {
      const response = await fetch(`${this.dataService.API_BASE_URL}videos/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.dataService.user.token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        this.dataService.wrongData = errorData.error || 'Fehler beim Abrufen der Daten.';
        return;
      }
      const responseData = await response.json();
      this.saveResponseDataVideosGet(responseData);
    } catch (error) {
      this.dataService.wrongData = 'Keine Daten erhalten.';
    }
  }


  /**
  * Processes the API response after saving a viewer and updates the viewer list.
  * Handles errors or resets to the viewer selection page on success.
  */
  saveResponseDataVideosGet(responseData: any) {
    if (responseData) {
      this.dataService.videoCollection = responseData.map((video: any) => new Video(video));
      console.log("piojoiuioiop", this.dataService.videoCollection)
    } else {
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

  /**
  * Saves the new password to the API using a POST request.
  */
  async savePasswortOnAPI() {
    try {
      const response = await fetch(`${this.dataService.API_BASE_URL}authentication/old_password_reset/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.dataService.user.token}`,
        },
        body: JSON.stringify({ old_password: this.dataService.editOldPasswordInput, password: this.dataService.editNewPasswordInput, repeated_password: this.dataService.editRepeatedPasswordInput }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        this.dataService.wrongData = errorData.detail;
        return;
      }
      this.loadEditUserContentContent();
    } catch (error) {
      this.dataService.wrongData = 'Keine Daten erhalten.';
    }
  }

  /**
  * Loads the edit user content and resets previous states.
  */
  loadEditUserContentContent() {
    this.dataService.resetBooleanOfConten();
    this.dataService.resetEditContent();
    this.dataService.editUserIsActive = true;
  }
}
