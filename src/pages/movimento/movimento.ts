import { Veiculo } from './../../entity/Veiculo';
import { FirestoreProvider } from './../../providers/firestore/firestore';
import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the MovimentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-movimento',
  templateUrl: 'movimento.html',
})
export class MovimentoPage {

  idViagem: string;
  idVeiculo: string;
  viagem;
  veiculo;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public global: GlobalProvider, 
    private firestore: FirestoreProvider) {
  }

  ionViewDidEnter() {
    this.viagem = this.global.Viagem;
    this.veiculo = this.global.Veiculo;
    console.log('Entrou na pagina',this.veiculo, this.viagem)
  }

  openCaptura() {
    //let modal = this.modalController.create('CapturaPage');
    //modal.present();
    this.navCtrl.push('CapturaPage');
  }

  iniciar() {
    this.firestore.criarParada("Local 1");
  }

  encerrar() {
    this.firestore.encerrarParada();
  }

  get emParada() {
    return this.firestore.isEmParada();
  }

}
