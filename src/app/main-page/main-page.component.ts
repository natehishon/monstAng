import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})

export class MainPageComponent implements OnInit, OnDestroy {

  private userSub: Subscription;
  public user;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.userSub = this.authService.getUserListener().subscribe(user => {
      this.user = user;
    });

  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
