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
  private courseTrackingSub: Subscription;
  completedCourses: CourseTracking[] = [];
  currentCourses: CourseTracking[] = [];
  isLoading = false;
  displayedColumns: string[] = ['status', 'courseName', 'grade', 'term', 'credits'];

  // public keyword will auto create a new prop and fill it
  constructor(public courseTrackingService: CourseTrackingService, private authService: AuthService) {}

  ngOnInit() {
    this.courseTrackingService.getCourseTrackings();
    this.isLoading = true;
    this.courseTrackingSub = this.courseTrackingService.getCourseUpdateListener()
      .subscribe((courseTrackings: CourseTracking[]) => {
      this.isLoading = false;
      this.courseTrackings = courseTrackings;
      console.log(this.courseTrackings);
      this.completedCourses = courseTrackings.filter(courseTracking => courseTracking.status === 'COMPLETE');
      this.currentCourses = courseTrackings.filter(courseTracking => courseTracking.status === 'ACTIVE');

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
