import { Routes } from '@angular/router';
import { TabsPage } from './shared/components/tabs/tabs.page';

export const routes: Routes = [

  {
    path: 'tb',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'inbox',
        loadComponent: () => import('./features/inbox/inbox.page').then(m => m.InboxPage)
      },
      {
        path: 'activity',
        loadComponent: () => import('./features/activity/activity.page').then(m => m.ActivityPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.page').then(m => m.ProfilePage)
      }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/home-login/home-login.page').then( m => m.HomeLoginPage)
  },

  {
    path: 'login',
    loadComponent: () => import('./features/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'property-view',
    loadComponent: () => import('./features/property-view/property-view.page').then( m => m.PropertyViewPage)
  },
  // {
  //   path: 'signup',
  //   loadComponent: () => import('./features/signup/signup.page').then( m => m.SignupPage)
  // },
  // {
  //   path: 'home',
  //   loadComponent: () => import('./features/home/home.page').then( m => m.HomePage)
  // },
  // {
  //   path: 'tabs',
  //   loadComponent: () => import('./shared/components/tabs/tabs.page').then( m => m.TabsPage)
  // },
];
