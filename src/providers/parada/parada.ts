import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

/*
  Generated class for the ParadaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ParadaProvider {

  constructor(private storage: Storage) {
    console.log('Hello StorageProvider Provider');
  }

  iniciarParada(time: Date) {
    this.storage.set('inicio_parada', time).then(() => {
      console.log('Parada iniciada');
    })
  }

  encerrarParada() {
    this.storage.remove('inicio_parada').then(() => {
      console.log('Parada encerrada');
    })
  }

  isEmParada() {
    return this.storage.get('inicio_parada').then((result:any) => {
      return result?true:false;
    })
  }

}
