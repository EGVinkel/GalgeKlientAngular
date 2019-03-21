import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {GameComponent} from './game/game.component';
import {LoginComponent} from './login/login.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    LoginComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
