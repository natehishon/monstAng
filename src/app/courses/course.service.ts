import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

import {Course} from './course.model';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/courses';

@Injectable({providedIn: 'root'})
export class CourseService {
  // reference type
  private courses: Course[] = [];
  private coursesUpdated = new Subject<{courses: Course[], coursesCount: number}>();

  constructor(private http: HttpClient, private router: Router) {
  }

  formatTime(date: Date) {

    let monthNames = [
      'January', 'February', 'March',
      'April', 'May', 'June', 'July',
      'August', 'September', 'October',
      'November', 'December'
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;

  }

  getCourses(coursesPerPage: number, currentPage: number, searchString: string) {

    const queryParams = `?pageSize=${coursesPerPage}&page=${currentPage}&searchValue=${searchString}`;
    this.http
      .get<{ message: string, courses: any, maxCourses: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(map(courseData => {
          return { courses: courseData.courses.map(course => {
            return {
              name: course.name,
              description: course.description,
              startDate: course.startDate,
              endDate: course.endDate,
              program: course.program,
              scheduleTime: course.scheduleTime,
              credits: course.credits,
              term: course.term,
              id: course._id
            };
          }), maxCourses: courseData.maxCourses
          };
        })
      )
      .subscribe((transFormedCourseData) => {
        this.courses = transFormedCourseData.courses;

        this.coursesUpdated.next({courses: [...this.courses], coursesCount: transFormedCourseData.maxCourses });
      });
  }

  getCourseUpdateListener() {
    return this.coursesUpdated.asObservable();
  }

  getCourse(id: string) {
    return this.http.get<{
      _id: string,
      name: string,
      description: string,
      startDate: string,
      endDate: string,
      program: string,
      scheduleTime: string,
      credits: number,
      term: string
    }>(BACKEND_URL + '/' + id);
  }

  addCourse(
    name: string,
    description: string,
    startDate: string,
    endDate: string,
    program: string,
    scheduleTime: string,
    credits: number,
    term: string
  ) {
    const course: Course = {
      id: null,
      name,
      description,
      startDate: this.formatTime(new Date(startDate)),
      endDate: this.formatTime(new Date(endDate)),
      program,
      scheduleTime,
      credits,
      term
    };
    this.http.post<{ message: string, courseId: string }>(BACKEND_URL, course)
      .subscribe(responseData => {
        // const id = responseData.courseId;
        // course.id = id;
        // this.courses.push(course);
        // this.coursesUpdated.next([...this.courses]);
        this.router.navigate(['/']);
      });
  }

  updateCourse(
    id: string,
    name: string,
    description: string,
    startDate: string,
    endDate: string,
    program: string,
    scheduleTime: string,
    credits: number,
    term: string
  ) {
    const course: Course = {
      id,
      name,
      description,
      startDate: this.formatTime(new Date(startDate)),
      endDate: this.formatTime(new Date(endDate)),
      program,
      scheduleTime,
      credits,
      term
    };
    this.http
      .put(BACKEND_URL + '/' + id, course)
      .subscribe(response => {
        // const updatedCourses = [...this.courses];
        // const oldCourseIndex = updatedCourses.findIndex(c => c.id === course.id);
        // updatedCourses[oldCourseIndex] = course;
        // this.courses = updatedCourses;
        // this.coursesUpdated.next([...this.courses]);
        this.router.navigate(['/']);
      });
  }

  deleteCourse(courseId: string) {
    return this.http.delete(BACKEND_URL + '/' + courseId);
  }


}
