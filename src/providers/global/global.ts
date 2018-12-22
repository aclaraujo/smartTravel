import { Injectable } from '@angular/core';
import { Pessoa } from '../../entity/Pessoa';

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

  constructor() {
    console.log('Hello GlobalProvider Provider');
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

}
