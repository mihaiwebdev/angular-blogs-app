import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loggedIns: boolean = true;

  constructor(
    private toastr: ToastrService,
    private auth: AngularFireAuth,
    private router: Router
  ) {}

  async login(email: string, password: string) {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
      this.toastr.success('Logged in successfully');
      this.router.navigate(['/']);
      this.loadUser();
      this.loggedIn.next(true);
    } catch (error) {
      console.log(error);
      this.toastr.error(error as string);
    }
  }

  loadUser() {
    return this.auth.authState;
  }

  async logout() {
    try {
      await this.auth.signOut();
      this.toastr.success('User Logged Out!');
      this.router.navigate(['/login']);
      this.loggedIn.next(false);
    } catch (error) {
      this.toastr.error(error as string);
    }
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
