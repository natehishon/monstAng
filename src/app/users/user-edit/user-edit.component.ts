import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {User} from '../../auth/user.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})

export class UserEditComponent implements OnInit, OnDestroy {

  isAdmin = false;
  private isAdminSub: Subscription;

  private userId: string;
  user: User;
  majors: any[] = [
    {value: 'Scaring', viewValue: 'Scaring'},
    {value: 'Risk Mngmt', viewValue: 'Risk Mngmt'},
    {value: 'Spookin', viewValue: 'Spookin'}
  ];

  degrees: any[] = [
    {value: 'Bachelor of Scaring', viewValue: 'Bachelor of Scaring'},
    {value: 'Master of Scaring', viewValue: 'Master of Scaring'}
  ];

  roles: any[] = [
    {value: 'USER', viewValue: 'User'},
    {value: 'ADMIN', viewValue: 'Admin'}
  ];
  constructor(public authService: AuthService, public route: ActivatedRoute) {}

  ngOnInit() {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.userId = paramMap.get('userId');
        // this.isLoading = true;
        this.authService.getUserById(this.userId).subscribe(userData => {
          // this.isLoading = false;
          this.user = {
            id: userData._id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            password: userData.password,
            major: userData.major,
            degree: userData.degree,
            gpa: userData.gpa
          };
          console.log(this.user);
        });
      } else {
        // throw error
      }
    });

    this.isAdmin = this.authService.getIsAdmin();
    this.isAdminSub = this.authService.getAdminStatusListener().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  onSaveUser(form: NgForm) {

    if (form.invalid) {
      return;
    }

    this.authService.updateUser(
      this.user.id,
      form.value.name,
      form.value.email,
      form.value.role,
      this.user.password,
      form.value.major,
      form.value.degree,
      form.value.gpa
    );

  }

  ngOnDestroy() {
    this.isAdminSub.unsubscribe();
  }



}
