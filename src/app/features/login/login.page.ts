import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { IonInput,IonItem, IonLabel } from '@ionic/angular/standalone';
import { AuthService, LoginRequest } from 'src/app/core/services/auth/auth';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule, IonInput,IonItem, IonLabel, HttpClientModule],
  providers: [AuthService, HttpClient],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);
  private authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  isPasswordVisible = signal(false);
  isLoading = signal(false);
  userRole = signal<'tenant' | 'owner'>('tenant');

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  selectUserRole(role: 'tenant' | 'owner') {
    this.userRole.set(role);
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Signing in...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const loginData = {
        ...this.loginForm.value,
        role: this.userRole(),
      };

      const response = await this.authService.login(loginData);

      if (response.success) {
        await this.presentToast('Login successful!', 'success');
        this.router.navigate(['/home']);
      }
    } catch (error: any) {
      await this.presentToast(error.message || 'Login failed. Please try again.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async onGoogleLogin() {
    const loading = await this.loadingCtrl.create({
      message: 'Connecting to Google...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const response = await this.authService.googleLogin(this.userRole());
      if (response.success) {
        await this.presentToast('Login successful!', 'success');
        this.router.navigate(['/home']);
      }
    } catch (error: any) {
      await this.presentToast(error.message || 'Google login failed.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  async forgotPassword() {
    this.router.navigate(['/home']);
    const alert = await this.alertCtrl.create({
      header: 'Reset Password',
      message: 'Enter your email address to receive a password reset link.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Enter your email',
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Send Reset Link',
          handler: async (data) => {
            if (data.email) {
              try {
                await this.authService.forgotPassword(data.email);
                await this.presentToast('Password reset link sent to your email!', 'success');
              } catch {
                await this.presentToast('Failed to send reset link.', 'danger');
              }
            }
          },
        },
      ],
    });

    await alert.present();
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'top',
      buttons: [{ text: 'Dismiss', role: 'cancel' }],
    });
    await toast.present();
  }
}
