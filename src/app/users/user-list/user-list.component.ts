import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../auth/user.model';
import {CourseService} from '../../courses/course.service';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';
import {Course} from '../../courses/course.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit, OnDestroy{

  users: User[] = [];
  private userSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUsers();
    this.userSub = this.authService.getUsersUpdateListener()
      .subscribe((users: User[]) => {
        // this.isLoading = false;
        this.users = users;
      });

  }

  ngOnDestroy() {

  }

}
