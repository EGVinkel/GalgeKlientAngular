import {Component, ViewChild, OnInit} from '@angular/core';
import {SessionStorageService} from 'angular-web-storage';
import {HttpClient} from '@angular/common/http';


interface Gamedata {
  Antal: string;
  Brugte: string;
  Ordet: string;
  Slut: string;
  SynligtOrd: string;
  Tabt: string;
  Vundet: string;

}

interface Player {
  name: string;
  score: number;
  pw: string;
  key: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  highscore: Player[];
  sessionmap: Player[];
  url: string;
  admin = false;
  name: string;
  key: string;
  antal: string;
  brugte: string;
  ordet: string;
  slut: boolean;
  synligt: string;
  tabt: boolean;
  vundet: boolean;
  image: string;
  score = 100;
  imgpath: string[] = [
    'assets/images/forkert0.png',
    'assets/images/forkert1.png',
    'assets/images/forkert2.png',
    'assets/images/forkert3.png',
    'assets/images/forkert4.png',
    'assets/images/forkert5.png',
    'assets/images/forkert6.png',
  ];

  constructor(public session: SessionStorageService, private http: HttpClient) {
    // this.url = 'http://localhost:5107/galgespil/galgeserver/';
    this.url = 'http://130.225.170.204:5107/galgespil/galgeserver/';
    this.name = session.get('user');
    this.key = session.get('key');
    if (this.name === 's175107') {
      this.admin = true;
    }
  }

  ngOnInit() {
    this.getdata();
    this.visHighscore();
    this.visaktive();

  }

  makeGuess(bogstav: string) {
    // 130.225.170.204
    this.http.post(this.url + 'guess/' + bogstav, {
      name: this.name,
      key: this.key
    }).subscribe(
      value => {
        console.log(value);
        this.getdata();
        this.visaktive();
      },
      error2 => {
        window.alert('Din spilsession eksitere ikke.');

        console.log(error2);
      }
    )
    ;

  }

  getdata() {
    this.http.get<Gamedata>(this.url + 'result/' + this.name + '/' + this.key).subscribe(
      (data: Gamedata) => {
        this.antal = data.Antal;
        this.brugte = data.Brugte;
        this.ordet = data.Ordet;
        this.slut = (data.Slut === 'true');
        this.vundet = (data.Vundet === 'true');
        this.synligt = data.SynligtOrd;
        this.tabt = (data.Tabt === 'true');
        this.image = this.imgpath[this.antal];
        if (this.vundet === true) {
          this.posthighscore();
          window.alert('Du har vundet, din score var: ' + this.score);
        }
        if (this.tabt === true) {
          this.image = this.imgpath[6];
          window.alert('Du har tabt ordet var:' + this.ordet);
        }
      },
      error1 => {
        window.alert('Der opstod en fejl ved hentning af data');
        console.log(error1);
      });
  }

  spiligen() {
    this.http.post(this.url + 'nulstil', {name: this.name, key: this.key}).subscribe(
      value => {
        this.getdata();
      },
      error2 => {
        window.alert('Der opstod en fejl ved hentning af data');
        console.log(error2);
      }
    )
    ;
  }

  visHighscore() {
    this.http.get<Player[]>(this.url + 'gethigh/' + this.key).subscribe(
      (key: Player[]) => {
        console.log(key);
        this.highscore = key;
      },
      error1 => {
        console.log(error1);
      });
  }

  posthighscore() {
    this.score = this.score + this.ordet.length * 10 - parseInt(this.antal, 10) * 10;
    this.http.post(this.url + 'newhighscore', {
      name: this.name,
      score: this.score
    }).subscribe(
      value => {
        this.visHighscore();
      },
      error2 => {
        window.alert('Der opstod en fejl ved hentning af data');
        console.log(error2);
      }
    )
    ;
  }

  visaktive() {
    this.http.get<Player[]>(this.url + 'getmap/' + this.key).subscribe(
      (key: Player[]) => {
        console.log(key);
        this.sessionmap = key;
      },
      error1 => {
        console.log(error1);
      });
  }

  removeuser(username: string) {
    this.http.post(this.url + 'removeplayer', {
      name: username,
    }).subscribe(
      value => {
        console.log(value)
        this.visaktive();
      },
      error2 => {
        window.alert('Der opstod en fejl ved hentning af data');
        console.log(error2);
      }
    )
    ;
  }

  slethighscore() {
    this.http.delete(this.url + 'deletenewhighscore').subscribe(
      value => {
        this.visHighscore();
      },
      error2 => {
        window.alert('Der opstod en fejl');
        console.log(error2);
      }
    )
    ;
  }

}
