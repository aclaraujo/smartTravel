import { Veiculo } from './../entity/Veiculo';
import { GlobalProvider } from './../providers/global/global';
import { FirestoreProvider } from './../providers/firestore/firestore';
import { TabsPage } from './../pages/tabs/tabs';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ConfigPage } from '../pages/config/config';
import { MovimentoPage } from '../pages/movimento/movimento';
import { map } from 'rxjs/operators/map';
import { Storage } from '@ionic/storage';
import { Viagem } from './models/viagem.interface';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private db: FirestoreProvider,
    private localStorage: Storage,
    private global: GlobalProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Opções', component: ConfigPage },
      { title: 'Movimentação', component: MovimentoPage }      
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.iniciaVariaveisGlobais();
      this.splashScreen.hide();
    });
  }

  openHomePage() {
    this.statusBar.styleDefault();
    this.splashScreen.hide();
    this.openPage(this.pages[0]);
  }
  
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  iniciaVariaveisGlobais() {

    var veiculo;
    this.localStorage.get('veiculo').then((value:Veiculo)=>{
      console.log('Obtendo veiculo do store local',value)
      veiculo = value;
      if (veiculo){
        this.db.getVeiculo(veiculo.id).then(obj=>{
          this.global.Veiculo = obj;
        });
      }
    });

    var viagem:Viagem;
    this.localStorage.get('viagem').then((value:Viagem)=>{
      console.log('Obtendo viagem do store local',value)
      viagem = value;
      if (viagem) {
        console.log('Obtendo viagem do firebasel',viagem)
        this.db.getViagem(viagem.id).then(obj=>{
          this.global.Viagem = obj;
        })
      }
    })
    

    console.log('Variaveis globais setadas')
  }

}
