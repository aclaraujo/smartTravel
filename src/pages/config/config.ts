import { GlobalProvider } from './../../providers/global/global';
import { FirestoreProvider } from './../../providers/firestore/firestore';
import { ORMProvider } from './../../providers/database/orm';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Viagem } from '../../app/models/viagem.interface';
import { Observable } from 'rxjs';
/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  public viagens;
  public veiculos;
  viagem: any;
  veiculo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private global: GlobalProvider, 
    private firestore: FirestoreProvider) {
  }

  ionViewDidLoad() {
    this.getAllViagens();
    this.getAllVeiculos();
  }

  async getAllViagens() {
    this.viagens = this.firestore.listViagens();
  }

  async getAllVeiculos() {
    this.veiculos = this.firestore.listVeiculos();
  }

  saveViagem() {
    this.global.Viagem = this.viagem;
  }
  saveVeiculo() {
    this.global.Veiculo = this.veiculo;
  }
}
