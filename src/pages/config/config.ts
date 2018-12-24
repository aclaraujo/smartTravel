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
    private storage: Storage, 
    private firestore: FirestoreProvider) {
  }

  ionViewDidLoad() {
    this.getAllViagens();
    this.getAllVeiculos();
    this.storage.get("viagem").then((value:any) => {
      console.log('Viagem selecionada ', value);
      this.viagem = value;
    });
    this.storage.get("veiculo").then((value:any) => {
      console.log('Veiculo selecionado ', value);
      this.veiculo = value;
    });
  }

  async getAllViagens() {
    this.viagens = this.firestore.listViagens();
  }

  async getAllVeiculos() {
    this.veiculos = this.firestore.listVeiculos();
  }

  saveViagem() {
    this.storage.set("viagem", this.viagem).then(() =>{
      console.log('salvo');
    });
    
  }
  saveVeiculo() {
    this.storage.set("veiculo", this.veiculo).then(() =>{
      console.log('salvo');
    });
    
  }
}
