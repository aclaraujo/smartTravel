import { ConsultaPage } from './../consulta/consulta';
import { MovimentoPage } from './../movimento/movimento';
import { ConfigPage } from './../config/config';
import { Component } from '@angular/core';

import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ConfigPage;
  tab3Root = MovimentoPage;
  tab4Root = ConsultaPage

  constructor() {

  }
}
