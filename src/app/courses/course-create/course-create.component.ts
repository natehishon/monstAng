import {Component, OnInit} from '@angular/core';

import { Course } from '../course.model';
import {NgForm} from '@angular/forms';
import {CourseService} from '../course.service';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.scss']
})
export class CourseCreateComponent implements OnInit {
  enteredName = '';
  enteredDescription = '';
  isLoading = false;
  private mode = 'create';
  private courseId: string;
  course: Course;

  constructor(public courseService: CourseService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('courseId')) {
        this.mode = 'edit';
        this.courseId = paramMap.get('courseId');
        this.isLoading = true;
        this.courseService.getCourse(this.courseId).subscribe(courseData => {
          this.isLoading = false;
          this.course = {id: courseData._id, name: courseData.name, description: courseData.description};
        });
      } else {
        this.mode = 'create';
        this.courseId = null;
      }
    });
  }

  onSaveCourse(form: NgForm) {

    if (form.invalid) {
      return;
    }
    this.isLoading = true;

    if (this.mode === 'create') {
      this.courseService.addCourse(form.value.name, form.value.description);
    } else {
      this.courseService.updateCourse(this.courseId, form.value.name, form.value.description);
    }
    form.resetForm();
  }
}

