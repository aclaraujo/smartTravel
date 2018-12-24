import { Parada } from './../../app/models/parada.interface';
import { Viagem } from './../../entity/Viagem';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from 'angularfire2/firestore';
import { map } from 'rxjs/operators/map';
import { Veiculo } from '../../app/models/veiculo.interface';
import { Identifiers } from '@angular/compiler';

/*
  Generated class for the FirestoreProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirestoreProvider {

  listDocumentToDomainObject = _ => {
    const object = _.payload.doc.data();
    object.id = _.payload.doc.id;
    return object;
  }

  viagens: AngularFirestoreCollection<Viagem>;
  veiculos: AngularFirestoreCollection<Veiculo>;
  paradasAtivas: AngularFirestoreCollection<Parada>;

  constructor(private store: AngularFirestore) {
    this.viagens = this.store.collection<Viagem>('viagens');
    this.veiculos = this.store.collection<Veiculo>('veiculos');
    this.paradasAtivas = this.store.collection<Parada>('paradasAtivas');
  }

  listViagens() {
    let viagens = this.viagens.snapshotChanges()
    .pipe(map(actions => actions.map(this.listDocumentToDomainObject)));
    return viagens;
  }

  listVeiculos() {
    let veiculos = this.veiculos.snapshotChanges()
    .pipe(map(actions => actions.map(this.listDocumentToDomainObject)));
    return veiculos;
  }

  getViagem(id: string):AngularFirestoreDocument<Viagem> {
    return this.store.collection('viagens').doc(id);
  }

  getVeiculo(id: string):AngularFirestoreDocument<Veiculo> {
    return this.store.collection('veiculos').doc(id);
  }

  criarParada(
    endereco: string,
    inicio: Date,
    idViagem: string,
    idVeiculo: string
  ): Promise<DocumentReference> {
    const id = this.store.createId();
    const parada = {
      endereco,
      idVeiculo,
      idViagem
    } as Parada;
    return this.paradasAtivas.add(parada);
  }

}
