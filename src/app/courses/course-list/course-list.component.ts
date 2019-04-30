import {Component, OnDestroy, OnInit} from '@angular/core';
import { CourseService } from '../course.service';
import {Course} from '../course.model';

import { Subscription } from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {MatTableDataSource, PageEvent} from '@angular/material';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})

export class CourseListComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  isLoading = false;
  totalCourses = 0;
  coursesPerPage = 5;
  currentPage = 0;
  pageSizeOptions = [5, 10];
  searchValue = '';
  private courseSub: Subscription;
  private authStatusSub: Subscription;
  private adminStatusSub: Subscription;
  public userIsAuthenticated = false;
  public userIsAdmin = false;

  displayedColumns: string[] = ['name', 'program', 'credits', 'term', 'action'];
  dataSource;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  search(searchValue: string) {
    this.searchValue = searchValue;
    this.courseService.getCourses(this.coursesPerPage, 1, this.searchValue);
    this.totalCourses = this.courses.length;
    // this.currentPage = 1;

  }

  // public keyword will auto create a new prop and fill it
  constructor(public courseService: CourseService, private authService: AuthService) {}

  onChangedPage(pageData: PageEvent) {

    this.currentPage = pageData.pageIndex;
    this.coursesPerPage = pageData.pageSize;
    this.courseService.getCourses(this.coursesPerPage, this.currentPage + 1, this.searchValue);


  }

  ngOnInit() {
    this.courseService.getCourses(this.coursesPerPage, 1, this.searchValue);
    this.isLoading = true;
    this.courseSub = this.courseService.getCourseUpdateListener()
      .subscribe((courseData: {courses: Course[], coursesCount: number} ) => {
      this.isLoading = false;
      this.courses = courseData.courses;
      this.dataSource = new MatTableDataSource(this.courses);
      this.totalCourses = courseData.coursesCount;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userIsAdmin = this.authService.getIsAdmin();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
    this.adminStatusSub = this.authService
      .getAdminStatusListener()
      .subscribe(isAdmin => {
        this.userIsAdmin = isAdmin;
      });
  }

  onDelete(courseId: string) {
    this.courseService.deleteCourse(courseId).subscribe(() => {
      this.courseService.getCourses(this.coursesPerPage, this.currentPage, this.searchValue);
    });
  }

  ngOnDestroy() {
    this.courseSub.unsubscribe();
    this.authStatusSub.unsubscribe();
    this.adminStatusSub.unsubscribe();
  }
}
