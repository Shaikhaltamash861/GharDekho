import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { IonInput, IonButton, IonIcon, IonSpinner, IonContent } from '@ionic/angular/standalone';
import { AuthService, LoginRequest } from 'src/app/core/services/auth/auth';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, IonInput, IonButton, IonIcon, IonSpinner, IonContent],
  providers: [AuthService, HttpClient],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  isPasswordVisible = false;
  isLoading = false;

  private router = inject(Router);
  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  async onLogin() {
    if (this.loginForm.valid) {
      // const loading = await this.loadingController.create({
      //   message: 'Signing in...',
      //   duration: 2000
      // });

      // await loading.present();
      this.router.navigate(['/tb/home']);

      // Simulate API call
      // setTimeout(async () => {
      //   await loading.dismiss();
      //   // Navigate to home or dashboard
      //   this.navCtrl.navigateForward('/tb/home');
      // }, 2000);
    } else {
      this.showValidationErrors();
    }
  }

  async showValidationErrors() {
    const alert = await this.alertController.create({
      header: 'Invalid Input',
      message: 'Please check your email and password.',
      buttons: ['OK']
    });
    await alert.present();
  }

  goBack() {
    this.navCtrl.back();
  }

  forgotPassword() {
    // Handle forgot password logic
    console.log('Forgot password clicked');
  }

  continueWithGoogle() {
    console.log('Continue with Google');
  }

  continueWithApple() {
    console.log('Continue with Apple');
  }

  continueWithFacebook() {
    console.log('Continue with Facebook');
  }

  navigateToSignUp() {
    this.navCtrl.navigateForward('/signup');
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}