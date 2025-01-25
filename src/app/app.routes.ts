import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { ResetPasswordPageComponent } from './reset-password-page/reset-password-page.component';

export const routes: Routes = [

    { path: '', component: LoginPageComponent, },
    { path: 'reset-password', component: ResetPasswordPageComponent, },

];
