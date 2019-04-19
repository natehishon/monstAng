import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Course } from './course.model';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class CourseService {
  // reference type
  private courses: Course[] = [];
  private coursesUpdated = new Subject<Course[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getCourses() {
    // new array
    this.http
      .get<{message: string, courses: any }>(
        'http://localhost:3000/api/courses'
      )
      .pipe(map(courseData => {
        return courseData.courses.map(course => {
          return {
            name: course.name,
            description: course.description,
            id: course._id
          };
        });
      }))
      .subscribe((courseData) => {
        this.courses = courseData;
        this.coursesUpdated.next([...this.courses]);
      });
  }

  getCourseUpdateListener() {
    return this.coursesUpdated.asObservable();
  }

  getCourse(id: string) {
    // spread operator
    return this.http.get<{_id: string, name: string, description: string }>('http://localhost:3000/api/courses/' + id);
  }

  addCourse(name: string, description: string) {
    const course: Course = { id: null, name: name, description: description };
    this.http.post<{ message: string, courseId: string }>('http://localhost:3000/api/courses', course)
      .subscribe(responseData => {
        const id = responseData.courseId;
        course.id = id;
        this.courses.push(course);
        this.coursesUpdated.next([...this.courses]);
        this.router.navigate(["/"]);
      });
  }

  updateCourse(id: string, name: string, description: string) {
    const course: Course = { id: id, name: name, description: description};
    this.http
      .put('http://localhost:3000/api/courses/' + id, course)
      .subscribe(response => {
        const updatedCourses = [...this.courses];
        const oldCourseIndex = updatedCourses.findIndex(c => c.id === course.id);
        updatedCourses[oldCourseIndex] = course;
        this.courses = updatedCourses;
        this.coursesUpdated.next([...this.courses]);
        this.router.navigate(["/"]);
      });
  }

  deleteCourse(courseId: string) {
    this.http.delete('http://localhost:3000/api/courses/' + courseId)
      .subscribe(() => {
        const updatedCourses = this.courses.filter(course => course.id !== courseId);
        this.courses = updatedCourses;
        this.coursesUpdated.next([...this.courses]);
      });
  }


}
