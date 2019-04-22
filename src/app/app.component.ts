import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss',
    '../../node_modules/bulma/bulma.sass']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {}


  ngOnInit() {
    this.authService.autoAutoUser();
  }
}
