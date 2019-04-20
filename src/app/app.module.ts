import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule, MatDatepicker, MatDatepickerToggle, MatDatepickerModule, MatNativeDateModule, MatSelectModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { CourseCreateComponent } from './courses/course-create/course-create.component';
import { HeaderComponent} from './header/header.component';
import { CourseListComponent} from './courses/course-list/course-list.component';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './auth/login/login.component';
import {SignUpComponent} from './auth/signup/signup.component';
import {AuthInterceptor} from './auth/auth-interceptor';
import {CourseTrackingCreateComponent} from './course-tracking/course-tracking-create/course-tracking-create.component';
import {CourseTrackingListComponent} from './course-tracking/course-tracking-list/course-tracking-list.component';
import {MainPageComponent} from './main-page/main-page.component';

@NgModule({
  declarations: [
    AppComponent,
    CourseCreateComponent,
    HeaderComponent,
    CourseListComponent,
    CourseTrackingListComponent,
    LoginComponent,
    SignUpComponent,
    CourseTrackingCreateComponent,
    MainPageComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    HttpClientModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
