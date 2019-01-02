import { FirestoreProvider } from './../../providers/firestore/firestore';
import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

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
    private firestore: FirestoreProvider,
    private alertCtrl: AlertController,
    private geo: Geolocation) {
  }

  ionViewDidEnter() {
    this.viagem = this.global.Viagem;
    this.veiculo = this.global.Veiculo;
    console.log('Entrou na pagina', this.veiculo, this.viagem)
  }

  openCaptura() {
    //let modal = this.modalController.create('CapturaPage');
    //modal.present();
    this.navCtrl.push('CapturaPage');
  }

  async iniciar() {
    this.geo.getCurrentPosition().then((position)=>{
      const latlong=position.coords
      this.firestore.criarParada(latlong.latitude, latlong.longitude);
    },(reject)=>{
      this.firestore.criarParada(0,0);
    })
    
  }

  encerrar() {
    let confirm = this.alertCtrl.create({
      title: 'Confirmar encerramento',
      message: 'Ainda restam passageiros a embarcar. Deseja encerrar mesmo assim?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.firestore.encerrarParada();
          }
        }
      ]
    })

    if (this.global.QtdRestante>0) {
      confirm.present();
    } else {
      this.firestore.encerrarParada();
    }
  }

  get emParada() {
    return this.global.Veiculo.paradaAtual ? true : false;
  }

}
