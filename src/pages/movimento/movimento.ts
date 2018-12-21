import { ParadaProvider } from './../../providers/parada/parada';
import { DatabaseProvider } from './../../providers/database/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, DateTime } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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

  viagem: any = [];
  veiculo: any = [];
  emParada: Boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private db: DatabaseProvider, private storage: Storage, 
    private modalController: ModalController, 
    private paradaProvider: ParadaProvider) {
  }

  ionViewDidLoad() {
    this.storage.get('id_viagem_sel').then((id:any) => {
      this.db.getViagem(id).then((viagem:any)=> {
        this.viagem = viagem;
      })
    })
    
    this.storage.get('id_veiculo_sel').then((id:any) => {
      this.db.getVeiculo(id).then((veiculo:any)=> {
        this.veiculo = veiculo;
      })
    })

    this.paradaProvider.isEmParada().then((value:Boolean) => {
      this.emParada = value;
    })

    console.log('ionViewDidLoad MovimentoPage');
  }

  openCaptura() {
    //let modal = this.modalController.create('CapturaPage');
    //modal.present();
    this.navCtrl.push('CapturaPage');
  }

  iniciar() {
    this.paradaProvider.iniciarParada(new Date());
    this.emParada = true;
  }

  encerrar() {
    this.paradaProvider.encerrarParada();
    this.emParada = false;
  }

  isEmParada() {
    return this.paradaProvider.isEmParada().then((result:Boolean) => {
      return result;
    })
  }

}
