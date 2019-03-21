import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SessionStorageService} from 'angular-web-storage';


interface LogString {
  status: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() pwaccept = new EventEmitter<boolean>();
  url: string;

  constructor(private http: HttpClient, public session: SessionStorageService) {
    // this.url = 'http://localhost:5107/galgespil/galgeserver/login';
    this.url = 'http://130.225.170.204:5107/galgespil/galgeserver/login';
  }

  ngOnInit() {

  }


  login(username: string, password: string) {
    let obscure: Array<string>;
    obscure = password.split('');
    let i: number;
    let add: string;
    let newpass: string;
    newpass = ' ';
    for (i = 0; i <= obscure.length - 1; i++) {
      add = this.getrandomchars() + obscure[i];
      newpass = newpass.concat(add);
    }

    console.log(newpass);

    this.http.get<LogString>(this.url + '/' + username + '/' + newpass).subscribe(
      (key: LogString) => {
        this.session.set('key', key.status);
        this.session.set('user', username);
        this.session.set('loggedin', true);
        this.pwaccept.emit(true);
      },
      error1 => {
        window.alert('Der opstod en fejl ved login');
        console.log(error1);
        this.session.set('loggedin', false);
        this.pwaccept.emit(false);
      });
  }

  getrandomchars(): string {
    const random = '*abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let index = 0;
    let i: number;
    let returnval = '';
    for (i = 0; i < 39; i++) {
      index = Math.random() * random.length;
      returnval = returnval.concat(random.charAt(index));
    }
    return returnval;
  }


}
