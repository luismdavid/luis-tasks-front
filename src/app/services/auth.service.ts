import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CredentialsModel } from '../models/credentials.model';
import { UserModel } from '../models/user.model';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: BehaviorSubject<UserModel> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private helper: JwtHelperService,
    private plt: Platform
  ) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    return this.storage.get(TOKEN_KEY).then((token) => {
      if (token) {
        const decoded = this.helper.decodeToken(token);
        const isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.currentUser.next(decoded);
        } else {
          this.storage.remove(TOKEN_KEY);
        }
      }
    });
  }

  subUser() {
    return this.currentUser;
  }

  registerUser(user: UserModel) {
    return this.http
      .post<UserModel>(environment.API + '/auth/register', user)
      .pipe(tap((user) => this.currentUser.next(user)));
  }

  loginUser(credentials: CredentialsModel) {
    return this.http
      .post<UserModel>(environment.API + '/auth/login', credentials)
      .pipe(
        tap((res) => {
          this.storage.set(TOKEN_KEY, res['token']);
          this.currentUser.next(res['user']);
        })
      );
  }

  isLoggedIn() {
    return this.http
      .get<UserModel>(environment.API + '/auth')
      .pipe(tap((user) => this.currentUser.next(user)));
  }
}
