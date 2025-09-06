import { Component, Optional } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular/standalone';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private platform: Platform, @Optional() private routerOutlet?: IonRouterOutlet) {
    this.showSplash();
    this.initializeApp();
    this.platform.ready().then(() => {
      // Platform is ready and plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('Platform ready');
    });

    this.platform.backButton.subscribeWithPriority(-1, () => {
      App.addListener('backButton', ({ canGoBack }) => {
        console.log('Back button pressed', canGoBack);
        if (canGoBack) {
          App.minimizeApp();
        }
      });
    });
  }

 async initializeApp() {
    await this.platform.ready();

    try {
      // Set background color to black
      await StatusBar.setBackgroundColor({ color: '#000000' });

      // Set status bar icons to light (white icons on black background)
      await StatusBar.setStyle({ style: Style.Light });

      // (Optional) make sure it’s not hidden
      await StatusBar.show();
    } catch (err) {
      console.warn('StatusBar plugin not available:', err);
    }
  }


  async showSplash() {
    SplashScreen.show({
      showDuration: 2000,
    }).then(async () => {
      await SplashScreen.hide();
    });


  }
}
