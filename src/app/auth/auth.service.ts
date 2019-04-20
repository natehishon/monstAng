import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model';
import {User} from './user.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private isAuthenticated = false;
  private isAdmin = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>()
  private authAdminListener = new Subject<boolean>()
  private userListener = new Subject<User>()
  public user: User

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUser() {
    return this.user;
  }

  getIsAdmin() {
    return this.isAdmin;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserListener() {
    return this.userListener.asObservable();
  }

  getAdminStatusListener() {
    return this.authAdminListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    console.log(email);
    this.http.post(BACKEND_URL + 'signup', authData)
      .subscribe(response => {
        this.router.navigate(['login']);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, role: string, email: string, expiresIn: number}>(BACKEND_URL + 'login', authData)
      .subscribe(response => {
        const token = response.token;
        const role = response.role;
        this.token = token;
        if (token) {

          if (role) {
            if (role === 'ADMIN') {
              this.isAdmin = true;
              this.authAdminListener.next(true);
            } else {

            }
          }

          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const user = {
            email: response.email,
            role: ''
          }
          this.user = user;
          this.userListener.next(user);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, role, response.email);
          this.router.navigate(['/']);
        }
      });
  }

  autoAutoUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true);
      const user = {
        email: authInformation.email,
        role: ''
      }
      this.user = user;
      this.authStatusListener.next(true);
      this.userListener.next(user);

      const role = authInformation.role;
      if (role) {
        if (role === 'ADMIN') {
          this.isAdmin = true;
          this.authAdminListener.next(true);
        } else {
          this.authAdminListener.next(true);
        }
      }


    }

  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.authStatusListener.next(false);
    this.authAdminListener.next(false);
    this.userListener.next(null);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, role: string, email: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('role', role);
    localStorage.setItem('email', email);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    if (!token || !expirationDate || !role || !email) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      role: role,
      email: email
    };
  }
}
