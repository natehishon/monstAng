import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import {Router} from '@angular/router';

import {environment} from '../../environments/environment';
import {Course} from '../courses/course.model';
import {CourseTracking} from './courseTracking.model';

const BACKEND_URL = environment.apiUrl + '/courseTracking';


@Injectable({providedIn: 'root'})
export class CourseTrackingService {

  private courseTrackings: CourseTracking[] = [];
  private courseTrackingUpdated = new Subject<CourseTracking[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getCourseTracking(courseId: string) {
    return this.http.get<{courseTracking: [] }>(BACKEND_URL + '/' + courseId);
  }

  getCourseTrackings() {
    this.http
      .get<{message: string, courseTrackings: any }>(
        BACKEND_URL
      )
      .pipe(map(courseTrackingData => {
        return courseTrackingData.courseTrackings.map(courseTracking => {
          return {
            courseName: courseTracking.courseName,
            status: courseTracking.status
          };
        });
      }))
      .subscribe((courseTrackingData) => {
        this.courseTrackings = courseTrackingData;
        this.courseTrackingUpdated.next([...this.courseTrackings]);
      });
  }

  getCourseUpdateListener() {
    return this.courseTrackingUpdated.asObservable();
  }

  enroll(courseId: string, courseName: string) {
    const course = {
      courseId: courseId,
      courseName: courseName
    }

    this.http.post<{courseId: string, courseName: string }>(BACKEND_URL, course)
      .subscribe(responseData => {
        console.log(responseData);
        this.router.navigate(['courseTrackings']);
        // const id = responseData.courseId;
        // course.id = id;
        // this.courses.push(course);
        // this.coursesUpdated.next([...this.courses]);
        // this.router.navigate(['/']);
      });
  }

}
