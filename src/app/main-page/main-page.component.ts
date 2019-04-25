import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';
import {CourseTrackingService} from '../course-tracking/course-tracking.service';
import {CourseTracking} from '../course-tracking/courseTracking.model';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})

export class MainPageComponent implements OnInit, OnDestroy {

  private userSub: Subscription;
  public user;
  public userById;
  public completeCourses = 0;

  courseTrackings: CourseTracking[] = [];
  currentCourseTrackings: CourseTracking[] = [];
  private courseTrackingSub: Subscription;

  constructor(private authService: AuthService, private courseTrackingService: CourseTrackingService) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.userSub = this.authService.getUserListener().subscribe(user => {
      this.user = user;
    });

    // this.isLoading = true;
    this.authService.getUserById(this.user.id).subscribe(userData => {
      // this.isLoading = false;
      this.userById = {
        id: userData._id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        password: userData.password,
        major: userData.major,
        degree: userData.degree,
        gpa: userData.gpa};
      console.log(this.user);
    });

    this.courseTrackingService.getCourseTrackings();
    this.courseTrackingSub = this.courseTrackingService.getCourseUpdateListener()
      .subscribe((courseTrackings: CourseTracking[]) => {
        this.courseTrackings = courseTrackings;

        courseTrackings.forEach(courseTracking => {
          if (courseTracking.status === 'COMPLETE') {
            this.completeCourses += 1;
          } else {
            console.log(courseTracking);
            this.currentCourseTrackings.push(courseTracking);
          }
        });

      });

  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.courseTrackingSub.unsubscribe();
  }
}
