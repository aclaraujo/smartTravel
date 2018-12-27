import { TabsPage } from './../pages/tabs/tabs';
import { MovimentoPage } from './../pages/movimento/movimento';
import { QRScanner } from '@ionic-native/qr-scanner';
import { ConfigPage } from './../pages/config/config';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SQLite } from '@ionic-native/sqlite';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { GlobalProvider } from '../providers/global/global';

//Firestore
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { firebaseConfig } from './credentials';
import { FirestoreProvider } from '../providers/firestore/firestore';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ConfigPage,    
    MovimentoPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__smartTraveldb',
      driverOrder: ['indexdb','sqlite','websql']
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ConfigPage,
    MovimentoPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    QRScanner,
    GlobalProvider,
    FirestoreProvider
  ]
})
export class AppModule {}
