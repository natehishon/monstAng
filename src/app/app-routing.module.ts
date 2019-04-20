import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CourseListComponent} from './courses/course-list/course-list.component';
import {CourseCreateComponent} from './courses/course-create/course-create.component';
import {LoginComponent} from './auth/login/login.component';
import {SignUpComponent} from './auth/signup/signup.component';
import {AuthGuard} from './auth/auth.guard';
import {CourseTrackingCreateComponent} from './course-tracking/course-tracking-create/course-tracking-create.component';
import {CourseTrackingListComponent} from './course-tracking/course-tracking-list/course-tracking-list.component';
import {MainPageComponent} from './main-page/main-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent, canActivate: [AuthGuard]},
  { path: 'courses', component: CourseListComponent, canActivate: [AuthGuard]},
  { path: 'courseTrackings', component: CourseTrackingListComponent, canActivate: [AuthGuard]},
  { path: 'create', component: CourseCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:courseId', component: CourseCreateComponent, canActivate: [AuthGuard]},
  { path: 'enroll/:courseId', component: CourseTrackingCreateComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {}
