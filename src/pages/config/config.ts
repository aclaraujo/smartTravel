import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

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

  viagens: any[] = [];
  veiculos: any[] = [];
  viagem_sel: any;
  veiculo_sel: any;

  selecao = {
    viagem: [],
    veiculo: 0
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: DatabaseProvider, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
    this.getAllViagens();
    this.getAllVeiculos();
    this.storage.get("id_viagem_sel").then((value:any) => {
      this.viagem_sel = value;
    });
    this.storage.get("id_veiculo_sel").then((value:any) => {
      this.veiculo_sel = value;
    });
  }

  getAllViagens() {
    this.db.getViagens()
      .then((result: any[]) => {
        this.viagens = result;     
      });
  }

  getAllVeiculos() {
    this.db.getVeiculos()
      .then((result: any[]) => {
        this.veiculos = result;     
      });
  }

  saveViagem() {
    this.storage.set("id_viagem_sel", this.viagem_sel).then((value: any) =>{
      console.log('salvo');
    });
    
  }
  saveVeiculo() {
    this.storage.set("id_veiculo_sel", this.veiculo_sel).then((value: any) =>{
      console.log('salvo');
    });
    
  }
}
