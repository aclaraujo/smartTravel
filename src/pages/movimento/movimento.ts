import { Veiculo } from './../../app/models/veiculo.interface';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { Viagem } from './../../entity/Viagem';
import { FirestoreProvider } from './../../providers/firestore/firestore';
import { GlobalProvider } from './../../providers/global/global';
import { ORMProvider } from './../../providers/database/orm';
import { ParadaProvider } from './../../providers/parada/parada';
import { DatabaseProvider } from './../../providers/database/database';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, DateTime } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

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
  emParada: Boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private db: DatabaseProvider, private storage: Storage, 
    private modalController: ModalController, 
    private paradaProvider: ParadaProvider,
    private orm: ORMProvider, 
    public global: GlobalProvider, 
    private firestore: FirestoreProvider) {
  }

  ionViewDidEnter() {

    this.storage.get('viagem').then((id:any) => {
      this.idViagem = id; 
      this.viagem = this.firestore.getViagem(id).valueChanges();
    })
    
    this.storage.get('veiculo').then((id:any) => {
      this.idVeiculo = id;
      this.veiculo = this.firestore.getVeiculo(id).valueChanges();
    })

    this.paradaProvider.isEmParada().then((value:Boolean) => {
      this.emParada = value;
    })
  }

  openCaptura() {
    //let modal = this.modalController.create('CapturaPage');
    //modal.present();
    this.navCtrl.push('CapturaPage');
  }

  iniciar() {
    const endereco = "Local";
    const inicio = new Date();
    const idViagem = this.idViagem;
    const idVeiculo = this.idVeiculo;
    const parada = this.firestore.criarParada(
      endereco,
      inicio,
      idViagem,
      idVeiculo
    ).then((value) =>{
      console.log('Parada iniciada',value)
    }).catch((erro) => {
      console.log('Parada iniciado em modo offline')
    })
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
