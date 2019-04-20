import {Component, OnDestroy, OnInit} from '@angular/core';
import {CourseTracking} from '../courseTracking.model';

import { Subscription } from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {CourseTrackingService} from '../course-tracking.service';

@Component({
  selector: 'app-course-tracking-list',
  templateUrl: './course-tracking-list.component.html',
  styleUrls: ['./course-tracking-list.component.scss']
})

export class CourseTrackingListComponent implements OnInit, OnDestroy {
  courseTrackings: CourseTracking[] = [];
  isLoading = false;
  private courseTrackingSub: Subscription;


  // public keyword will auto create a new prop and fill it
  constructor(public courseTrackingService: CourseTrackingService, private authService: AuthService) {}

  ngOnInit() {
    this.courseTrackingService.getCourseTrackings();
    this.isLoading = true;
    this.courseTrackingSub = this.courseTrackingService.getCourseUpdateListener()
      .subscribe((courseTrackings: CourseTracking[]) => {
      this.isLoading = false;
      this.courseTrackings = courseTrackings;
    });
    // this.userIsAuthenticated = this.authService.getIsAuth();
    // this.authStatusSub = this.authService
    //   .getAuthStatusListener()
    //   .subscribe(isAuthenticated => {
    //   this.userIsAuthenticated = isAuthenticated;
    // });
  }

  ngOnDestroy() {
    this.courseTrackingSub.unsubscribe();
  }

  // onDelete(courseId: string) {
  //   this.courseService.deleteCourse(courseId);
  // }
  //
  // ngOnDestroy() {
  //   this.courseSub.unsubscribe();
  //   this.authStatusSub.unsubscribe();
  // }
}
