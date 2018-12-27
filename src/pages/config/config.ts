import { Veiculo } from './../../app/models/veiculo.interface';
import { Viagem } from './../../app/models/viagem.interface';
import { GlobalProvider } from './../../providers/global/global';
import { FirestoreProvider } from './../../providers/firestore/firestore';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';
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

  public viagens: Observable<Viagem[]>;
  public veiculos: Observable<Veiculo[]>;
  public viagem = new Viagem();
  public veiculo = new Veiculo();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private global: GlobalProvider,
    private firestore: FirestoreProvider) {
  }

  ionViewDidLoad() {
    this.getAllViagens();
    this.getAllVeiculos();
    this.viagem = this.global.Viagem;
    this.veiculo = this.global.Veiculo;
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

  public compare(a:any, b:any) {
    return a && b ? a.id === b.id : a === b;
  }
}
