import { GlobalProvider } from './../../providers/global/global';
import { Observable } from 'rxjs';
import { FirestoreProvider } from './../../providers/firestore/firestore';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Veiculo } from '../../app/models/veiculo.interface';
import { Pessoa } from '../../app/models/pessoa.interface';
import { map } from 'rxjs/operators';

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

  opcoes = [
    {value: 0, text: 'Ausente'},
    { value: 1, text: 'Embarque' },
    { value: 2, text: 'Desembarque' },
  ]

  visao: any = "geral";
  public veiculos: Observable<Veiculo[]>;
  public pessoas;
  veiculoSel = this.global.Veiculo.id;
  statusSel = this.opcoes[1].value



  constructor(public navCtrl: NavController, public navParams: NavParams,
    private db: FirestoreProvider,
    private loadingCtrl: LoadingController,
    private global: GlobalProvider) {

    const loading = loadingCtrl.create({
      content: 'Aguarde...',
    })
    loading.present();
    this.getAllVeiculos().then(() => {
      this.atualizar()
      loading.dismiss();
    });
    //this.getAllPessoas();

  }

  ionViewDidEnter() {
    const loading = this.loadingCtrl.create({
      content: 'Aguarde...',
    })
    loading.present();
    this.getAllVeiculos().then(() => {
      this.atualizar()
      loading.dismiss();
    });
  }

  async getAllVeiculos() {
    this.veiculos = await this.db.listVeiculosAtual();
  }

  async getAllPessoas() {
    this.pessoas = await this.db.listPessoas();
  }

  async listar() {
    this.pessoas = await this.db.listPessoasPorVeiculoStatus(this.veiculoSel, this.statusSel)
    console.log('Retornado', this.pessoas)
  }

  public atualizar() {
    this.listar();
  }

  public compare(a: any, b: any) {
    return a && b ? a.id === b.id : a === b;
  }

  public showDetalhe(veiculo) {
    console.log(veiculo)
    this.navCtrl.push(DetalheModal, {veiculo: veiculo})
  }

}

@Component({
  template: `<ion-header>

  <ion-navbar>
    <ion-title>{{veiculo.nome}}</ion-title>
  </ion-navbar>
  </ion-header>
  <ion-content padding>
  <ion-list>
  <ion-item *ngFor="let pessoa of pessoas | async">
  <ion-icon md="md-checkbox-outline" item-start *ngIf="pessoa.status==1"></ion-icon>
  <h2>{{pessoa.nome}}</h2>
  <p>{{pessoa.unidade}}</p>
</ion-item></ion-list>
</ion-content>`
})
export class DetalheModal {

  pessoas;
  veiculo;

  constructor(private navParams: NavParams,
    private db:FirestoreProvider) {
    this.veiculo = navParams.get('veiculo')
    this.listar()
  }

  async listar() {
    this.pessoas = await this.db.listPessoasPorVeiculoStatus(this.veiculo.id, 2)
  }
}