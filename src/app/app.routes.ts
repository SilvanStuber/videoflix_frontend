import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { ResetPasswordPageComponent } from './reset-password-page/reset-password-page.component';
import { ViewerPageComponent } from './viewer-page/viewer-page.component';
import { VideoCollectionComponent } from './video-collection/video-collection.component';

export const routes: Routes = [

    { path: '', component: LoginPageComponent, },
    { path: 'reset-password', component: ResetPasswordPageComponent, },
    { path: 'viewer-page', component: ViewerPageComponent, },
    { path: 'video-collection/:id', component: VideoCollectionComponent, },

];
