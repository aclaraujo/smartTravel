import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the ParadaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-parada',
  templateUrl: 'parada.html',
})
export class ParadaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private modalController: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParadaPage');
  }

  startScan(id:any) {
    //let modal = this.modalController.create('CapturaPage');
    //modal.present();
    this.navCtrl.setRoot('CapturaPage');
  }

}
