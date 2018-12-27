import { Parada } from './../../app/models/parada.interface';
import { Viagem } from './../../app/models/viagem.interface';
import { Veiculo } from './../../app/models/veiculo.interface';
import { Pessoa } from './../../app/models/pessoa.interface';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalProvider {

  private qtdEntrada: number = 0;
  private qtdSaida: number = 0;
  private listaSaida: Map<string, Pessoa> = new Map();
  private veiculo: Veiculo;
  private viagem: Viagem;
  private parada: Parada;

  constructor(private localStore: Storage) {
    console.log('Hello GlobalProvider Provider');
    /* this.localStore.get('veiculo').then((veiculo:any) => {
      this.veiculo = veiculo;
      console.log('Veiculo atual',veiculo)
    }) */
  }

  entrada() {    
    this.qtdEntrada++;
  }

  saida() {
    this.qtdSaida++;
  }

  get QtdEntrada():number {
    return this.veiculo.paradaAtual?this.veiculo.paradaAtual.qtdEntrada:0;
  }

  get QtdSaida():number {
    return this.veiculo.paradaAtual?this.veiculo.paradaAtual.qtdSaida:0;
  }

  get QtdRestante():number {
    if (this.veiculo.paradaAtual) {
      return this.veiculo.paradaAtual.qtdSaida - this.veiculo.paradaAtual.qtdEntrada
    }
    return 0;
  }

  incEntrada() {
    this.qtdEntrada++;
  }

  iniciar() {
    this.qtdEntrada = 0;
    this.qtdSaida = 0;
    this.listaSaida.clear();
  }

  get ListaSaida():Map<string, Pessoa> {
    return this.listaSaida;
  }

  
  public get Veiculo() : Veiculo {
    return this.veiculo;
  }

  public set Veiculo(v : Veiculo) {
    console.log('Set veiculo',v)
    this.localStore.set('veiculo',v);
    this.veiculo = v;
  }
  
  public get Viagem() : Viagem {
    return this.viagem;
  }

  public set Viagem(v : Viagem) {
    console.log('Set viagem',v);
    this.localStore.set('viagem',v);
    this.viagem = v;
  }

  public get Parada() : Parada {
    return this.parada;
  }

  public set Parada(p : Parada) {
    console.log('Set viagem',p);
    this.parada = p;
  }
}
