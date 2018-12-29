import { Observable } from 'rxjs';
import { FirestoreProvider } from './../../providers/firestore/firestore';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Veiculo } from '../../app/models/veiculo.interface';
import { Pessoa } from '../../app/models/pessoa.interface';

/**
 * Generated class for the ConsultaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-consulta',
  templateUrl: 'consulta.html',
})
export class ConsultaPage {

  visao:any = "geral";
  public veiculos: Observable<Veiculo[]>;
  public pessoas: Observable<Pessoa[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private db: FirestoreProvider, 
    private loadingCtrl: LoadingController) {
      let loading = loadingCtrl.create({
        content: 'Aguarde...',
        duration: 2000
      })
      loading.present();
      this.getAllVeiculos();
      this.getAllPessoas();
      loading.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConsultaPage');
  }

  async getAllVeiculos() {
    this.veiculos = await this.db.listVeiculos();
  }

  async getAllPessoas() {
    this.pessoas = await this.db.listPessoas();
  }

}