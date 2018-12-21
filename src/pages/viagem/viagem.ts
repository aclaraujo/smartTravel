import { ViagemProvider } from './../../providers/viagem/viagem';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ViagemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viagem',
  templateUrl: 'viagem.html',
})
export class ViagemPage {

  viagens: any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private viagemProvider: ViagemProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViagemPage');
    this.getAllViagens()
  }

  getAllViagens() {
    this.viagemProvider.getAll()
      .then((result: any[]) => {
        this.viagens = result;
      });
  }

  removeViagem(viagem: any){

  }

}
