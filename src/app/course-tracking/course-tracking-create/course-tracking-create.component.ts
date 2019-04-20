import {Component, OnInit} from '@angular/core';
import {CourseService} from '../../courses/course.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Course} from '../../courses/course.model';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';
import {CourseTrackingService} from '../course-tracking.service';

@Component({
  selector: 'app-course-tracking-create',
  templateUrl: './course-tracking-create.component.html',
  styleUrls: ['./course-tracking-create.component.scss']
})

export class CourseTrackingCreateComponent implements OnInit {

  private courseId: string;
  userId: string;
  isLoading = false;
  isEnrolled = false;
  course: Course;
  private userListenerSubs: Subscription;

  constructor(public courseService: CourseService, public courseTrackingService: CourseTrackingService, public authService: AuthService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('courseId')) {
        this.courseId = paramMap.get('courseId');
        this.isLoading = true;
        this.courseService.getCourse(this.courseId).subscribe(courseData => {
          this.isLoading = false;
          this.course = {id: courseData._id, name: courseData.name, description: courseData.description, startDate: courseData.startDate, endDate: courseData.endDate, program: courseData.program};
          console.log(this.course);
        });

        this.courseTrackingService.getCourseTracking(this.courseId).subscribe(courseTrackingData => {
          if (courseTrackingData.courseTracking.length > 0 ) {
            console.log("courseTrackingData");
            console.log(courseTrackingData);
            this.isEnrolled = true;
          }
        });

        // this.userListenerSubs = this.authService.getUserIdListener().subscribe(userId => {
        //   console.log('hey');
        //   console.log(userId);
        //   this.userId = userId;
        // });
      } else {
        // throw error
      }
    });
  }

  enroll() {
    this.courseTrackingService.enroll(this.courseId, this.course.name);
  }

}
