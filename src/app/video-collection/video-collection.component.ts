import { Component, HostListener, ElementRef, ViewChild, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { VideoService } from '../service/video.service';
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

  constructor(public dataService: DataService, public apiService: ApiService, public videoService: VideoService, private route: ActivatedRoute, private router: Router) { }

  /**
  * Initializes the component, retrieves the viewer ID from the route, 
  * loads the user from local storage, and fetches viewer data.
  */
  ngOnInit(): void {
    this.dataService.isUserAuthenticated();
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.dataService.idViewer = +idParam;
      }
    });
    this.dataService.loadUserFromLocalStorage();
    this.apiService.getViewerData();
    this.apiService.getVideoData();
  }

  /**
  * Displays the menu by setting `menuVisible` to true.
  */
  showMenu() {
    this.dataService.menuVisible = true;
  }

  /**
  * Hides the menu by setting `menuVisible` to false.
  */
  hideMenu() {
    this.dataService.menuVisible = false;
  }

  /**
  * Navigates back to the main page with the viewer ID.
  */
  backToMainPage() {
    this.router.navigate(['/video-collection', this.dataService.idViewer]);
  }

  /**
  * Navigates back to the video collection.
  */
  backToVodeioCollection() {
    this.dataService.resetBooleanOfConten();
    this.dataService.mainContentIsActive = true;
  }

  /**
  * Opens the edit viewer mode and sets viewer details.
  */
  editViewerOpen() {
    this.dataService.resetBooleanOfConten();
    this.dataService.viewername = this.dataService.singleViewer.viewername
    this.dataService.randomImgPath = String(this.dataService.singleViewer.picture_file);
    this.dataService.editViewerIsActive = true;
  }

  /**
  * Opens the edit user mode and resets content states.
  */
  editUserOpen() {
    this.dataService.resetBooleanOfConten();
    this.dataService.editUserIsActive = true;
  }

  /**
  * Switches the viewer and loads the viewer page.
  */
  switchViewer() {
    this.dataService.resetBooleanOfConten();
    this.dataService.mainContentIsActive = true;
    this.dataService.loadViwerPage()
  }

  /**
  * Opens the password edit mode and resets other content states.
  */
  openEditePassword() {
    this.dataService.resetBooleanOfConten();
    this.dataService.editPasswordIsActive = true;
  }

  /**
  * Toggles the visibility of the password input field.
  */
  toggleEditeOldPasswordVisibility() {
    this.dataService.editeOldPasswordVisible = !this.dataService.editeOldPasswordVisible;
  }

  /**
  * Toggles the visibility of the password input field.
  */
  toggleEditePasswordVisibility() {
    this.dataService.editePasswordVisible = !this.dataService.editePasswordVisible;
  }

  /**
  * Toggles the visibility of the password input field.
  */
  toggleEditeRepeatedPasswordVisibility() {
    this.dataService.editeRepeatedPasswordVisible = !this.dataService.editeRepeatedPasswordVisible;
  }

  /**
  * Resets the error state for the old password input.
  */
  resetErrorOldPassword() {
    if (this.dataService.editOldPasswordInput !== '') {
      this.dataService.emptyEditOldPasswordInput = false;
      if (this.dataService.editNewPasswordInput !== '' && this.dataService.editRepeatedPasswordInput !== '') {
        this.dataService.passwortEditeInputIsEmpty = false;
      } else {
        this.dataService.passwortEditeInputIsEmpty = true;
      }
    } else {
      this.dataService.passwortEditeInputIsEmpty = true;
      this.dataService.emptyEditOldPasswordInput = true;
    }
  }

  /**
  * Resets the error state for the new password input.
  */
  resetErrorNewPassword() {
    if (this.dataService.editNewPasswordInput !== '') {
      this.dataService.emptyEditNewPasswordInput = false;
      if (this.dataService.editOldPasswordInput !== '' && this.dataService.editRepeatedPasswordInput !== '') {
        this.dataService.passwortEditeInputIsEmpty = false;
      } else {
        this.dataService.passwortEditeInputIsEmpty = true;
      }
    } else {
      this.dataService.passwortEditeInputIsEmpty = true;
      this.dataService.emptyEditNewPasswordInput = true;
    }
  }

  /**
  * Resets the error state for the repeated password input.
  */
  resetErrorRepeatedPassword() {
    if (this.dataService.editRepeatedPasswordInput !== '') {
      this.dataService.emptyEditRepeatedPasswordInput = false;
      if (this.dataService.editNewPasswordInput !== '' && this.dataService.editOldPasswordInput !== '') {
        this.dataService.passwortEditeInputIsEmpty = false;
      } else {
        this.dataService.passwortEditeInputIsEmpty = true;
      }
      if (this.dataService.editNewPasswordInput === this.dataService.editRepeatedPasswordInput) {
        this.dataService.preparedPasswordsMatch = true;
      } else {
        this.dataService.preparedPasswordsMatch = false;
      }
    } else {
      this.dataService.passwortEditeInputIsEmpty = true;
      this.dataService.emptyEditRepeatedPasswordInput = true;
    }
  }

  /**
  * Closes the password edit mode and resets content states.
  */
  closeEditePassword() {
    this.dataService.resetBooleanOfConten();
    this.dataService.resetEditContent()
    this.dataService.editUserIsActive = true;
  }

  /**
  * Changes the video resolution and updates the selected URL.
  */
  changeResolution(url: string) {
    this.dataService.selectedResolution = url.startsWith('http')
      ? url
      : `${this.dataService.API_VIDEO_URL}${url}`;
    this.dataService.showSettingsMenu = false;
  }

  /**
  * Normalizes a URL by removing protocol and trailing slashes.
  */
  normalizeUrl(url: string): string {
    if (!url) return '';
    let normalizedUrl = url.trim().replace(/^https?:\/\//, '');
    if (normalizedUrl.startsWith('127.0.0.1:8000')) {
      normalizedUrl = normalizedUrl.replace(/^127.0.0.1:8000/, '');
    }
    return normalizedUrl.replace(/\/$/, '');
  }

  /**
  * Closes the settings menu when clicking outside of it.
  */
  @HostListener('document:click', ['$event'])
  closeMenuOnClickOutside(event: Event) {
    if (!event.target || !(event.target as HTMLElement).closest('.settings-container')) {
      this.dataService.showSettingsMenu = false;
    }
  }

  /**
  * Toggles the visibility of the settings menu.
  */
  toggleSettingsMenu() {
    this.dataService.showSettingsMenu = !this.dataService.showSettingsMenu;
  }

  /**
  * Hides the controls after a delay.
  */
  hideControlsAfterDelay() {
    this.dataService.hideSettingsMenu = true;
  }

  /**
  * Shows the controls by setting the menu visibility to false.
  */
  showControls() {
    this.dataService.hideSettingsMenu = false;
  }

  /**
  * Hides the controls if the video is playing and closes the settings menu if open.
  */
  hideControls() {
    if (!this.videoPlayer.nativeElement.paused) {
      this.dataService.hideSettingsMenu = true;
      if (this.dataService.showSettingsMenu) {
        this.toggleSettingsMenu();
      }

    }
  }

  /**
  * Validates if the viewer's content has been edited.
  */
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

  /**
  * Opens the username edit input and closes other edit inputs.
  */
  openEditeInputUsername() {
    this.dataService.closeEditeInput();
    this.dataService.inputUserEditIsActive = true;
  }

  /**
  * Opens the email edit input and closes other edit inputs.
  */
  openEditeInputEmail() {
    this.dataService.closeEditeInput();
    this.dataService.inputEmailEditIsActive = true;
  }

  /**
  * Validates if the user's content has been edited.
  */
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

  /**
  * Saves the edited user data if changes were made.
  */
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

  /**
  * Saves the new password if all validation checks pass.
  */
  saveNewPasswort() {
    if (!this.dataService.emptyEditOldPasswordInput &&
      !this.dataService.emptyEditNewPasswordInput &&
      !this.dataService.emptyEditRepeatedPasswordInput &&
      this.dataService.preparedPasswordsMatch &&
      !this.dataService.passwortEditeInputIsEmpty) {
      this.apiService.savePasswortOnAPI();
    }
  }

  /**
  * Saves the edited viewer data if changes were made.
  */
  saveEditViewer() {
    if (this.dataService.validationContent) {
      this.apiService.saveViewer();
      this.dataService.validationContent = false;
    }
  }

  /**
  * Closes the edit viewer mode and resets content states.
  */
  closeEditViewer() {
    this.dataService.resetBooleanOfConten();
    this.dataService.validationContent = false;
    this.dataService.mainContentIsActive = true;
  }
}

