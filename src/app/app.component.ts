import {Component} from '@angular/core';
import {SessionStorageService} from 'angular-web-storage';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent  {
  title = 'Galge';
  password: boolean;
  constructor(public session: SessionStorageService) {
  this.password = session.get('loggedin');
  }
  onPasswordaccept(password: boolean) {
    this.password = password;
  }

}
