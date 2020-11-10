import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toast: ToastService,
    private nav: NavController
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      name: new FormControl('', [
        Validators.maxLength(30),
        Validators.required,
      ]),
      lastname: new FormControl('', [
        Validators.maxLength(30),
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.maxLength(20),
        Validators.required,
      ]),
    });
  }

  createUser() {
    this.auth.registerUser(this.form.value).subscribe(
      () => {
        this.loading = true;
        this.nav.navigateRoot('/auth/login');
      },
      ({ error }) => {
        this.toast.show(error.message);
        this.loading = false;
      }
    );
  }
}
