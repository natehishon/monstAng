import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  isAdmin = false;
  private authListenerSubs: Subscription;
  private isAdminSub: Subscription;
  private userSub: Subscription;
  public user;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.isAdmin = this.authService.getIsAdmin();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
    this.isAdminSub = this.authService.getAdminStatusListener().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });

    this.user = this.authService.getUser();
    this.userSub = this.authService.getUserListener().subscribe(user => {
      this.user = user;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.isAdminSub.unsubscribe();
    this.userSub.unsubscribe();
  }

}

