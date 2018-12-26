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
  private veiculo: string;
  private viagem: string;

  constructor(private localStore: Storage) {
    console.log('Hello GlobalProvider Provider');
    this.localStore.get('veiculo').then((veiculo:any) => {
      this.veiculo = veiculo;
      console.log('Veiculo atual',veiculo)
    })
  }

  entrada() {    
    this.qtdEntrada++;
  }

  saida() {
    this.qtdSaida++;
  }

  get QtdEntrada():number {
    return this.qtdEntrada;
  }

  get QtdSaida():number {
    return this.qtdSaida;
  }

  get QtdRestante():number {
    return this.qtdSaida - this.qtdEntrada;
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

  
  public get Veiculo() : string {
    return this.veiculo;
  }

  public set Veiculo(v : string) {
    this.veiculo = v;
    this.localStore.set("veiculo", this.veiculo).then(() =>{
      console.log('salvo');
    });
  }
  
  public get Viagem() : string {
    return this.viagem;
  }

  public set Viagem(v : string) {
    this.viagem = v;
    this.localStore.set("viagem", this).then(() =>{
      console.log('salvo');
    });
  }
  
  

}
