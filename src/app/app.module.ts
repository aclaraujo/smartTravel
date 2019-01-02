import { Geolocation } from '@ionic-native/geolocation';
import { ModalComponent } from './../pages/captura/modal.component';
import { ConsultaPage, DetalheModal } from './../pages/consulta/consulta';
import { FirestoreProvider } from './../providers/firestore/firestore';
import { TabsPage } from './../pages/tabs/tabs';
import { MovimentoPage } from './../pages/movimento/movimento';
import { QRScanner } from '@ionic-native/qr-scanner';
import { ConfigPage } from './../pages/config/config';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, APP_INITIALIZER } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SQLite } from '@ionic-native/sqlite';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GlobalProvider } from '../providers/global/global';

//Firestore
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { firebaseConfig } from './credentials';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ConfigPage,    
    MovimentoPage,
    TabsPage,
    ConsultaPage,
    ModalComponent,
    DetalheModal
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
    TabsPage,
    ConsultaPage,
    ModalComponent,
    DetalheModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    QRScanner,
    GlobalProvider,
    FirestoreProvider,
    { provide: APP_INITIALIZER, useFactory: firestoreProviderFactory, deps: [FirestoreProvider], multi: true },
    Geolocation
  ]
})
export class AppModule {}

export function firestoreProviderFactory(provider: FirestoreProvider) {
  return () => provider.load();
}
