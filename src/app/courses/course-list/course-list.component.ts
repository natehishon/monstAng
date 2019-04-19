import {Component, OnDestroy, OnInit} from '@angular/core';
import { CourseService } from '../course.service';
import {Course} from '../course.model';

import { Subscription } from 'rxjs';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})

export class CourseListComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  isLoading = false;
  private courseSub: Subscription;
  private authStatusSub: Subscription;
  public userIsAuthenticated = false;

  // public keyword will auto create a new prop and fill it
  constructor(public courseService: CourseService, private authService: AuthService) {}

  ngOnInit() {
    this.courseService.getCourses();
    this.isLoading = true;
    this.courseSub = this.courseService.getCourseUpdateListener()
      .subscribe((courses: Course[]) => {
      this.isLoading = false;
      this.courses = courses;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onDelete(courseId: string) {
    this.courseService.deleteCourse(courseId);
  }

  ngOnDestroy() {
    this.courseSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
