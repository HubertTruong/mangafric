import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(
    private auth: AngularFireAuth,
    private router: Router
  ) {

  }

  initialise() {
    this.auth.onAuthStateChanged(user => {
      this.user$.next(user);
    });
  }

  getUserObservable(): Observable<User | undefined> {
    return this.auth.authState.pipe(
      map((user) => user as User | undefined)
    );
  }

  async signInWithEmailPassword(email: string, password: string) {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
      this.router.navigateByUrl('/');
      console.log('signInWithEmailPassword');
    }
    catch (e) {
      console.log(e);
    }

  }

  signUpWithEmailPassword(email: string, password: string) {
    try {
      this.auth.createUserWithEmailAndPassword(email, password);
      this.router.navigateByUrl('/');
    }
    catch (e) {
      console.log(e);
    }
  }

  async signout() {
    try {
      await this.auth.signOut();
      this.router.navigateByUrl('/login');
    }
    catch (e) {
      console.log(e);
    }
  }
}
