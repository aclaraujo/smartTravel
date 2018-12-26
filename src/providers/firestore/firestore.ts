import { GlobalProvider } from './../global/global';

import { Veiculo } from './../../app/models/veiculo.interface';
import { Pessoa, StatusPessoa } from './../../app/models/pessoa.interface';
import { Parada } from './../../app/models/parada.interface';
import { Viagem } from './../../entity/Viagem';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { map } from 'rxjs/operators/map';

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

  toPessoa(obj:any) {
    let p: Pessoa;
    p.nome = obj.get('nome');
    p.nascimento = obj.get('nascimento');
    p.onibus = obj.get('onibus');
    p.qrcode = obj.get('qrcode');
    p.rg = obj.get('rg');
    p.unidade = obj.get('unidade');
    return p;
  }

  viagens: AngularFirestoreCollection<Viagem>;
  veiculos: AngularFirestoreCollection<Veiculo>;
  paradas: AngularFirestoreCollection<Parada>;
  pessoas: AngularFirestoreCollection<Pessoa>;
  paradaAtual: Parada;

  constructor(private store: AngularFirestore,
    private global: GlobalProvider) {
    this.viagens = this.store.collection<Viagem>('viagens');
    this.veiculos = this.store.collection<Veiculo>('veiculos');
    this.paradas = this.store.collection<Parada>('paradas');
    this.pessoas = this.store.collection<Pessoa>('pessoas');
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

  getViagem(id: string): AngularFirestoreDocument<Viagem> {
    return this.store.collection('viagens').doc(id);
  }

  getVeiculo(id: string): AngularFirestoreDocument<Veiculo> {
    return this.store.collection('veiculos').doc(id);
  }

  findPessoaByQRCode(qrcode: string): Promise<Pessoa> {
    //localiza a pessoa pelo qrcode
    console.log('Buscando',qrcode)
    return new Promise<Pessoa>((resolve, reject) => {
      this.pessoas.ref.where('qrcode','==',qrcode).get().then((result) => {
        if(result.size>0) {
          var p: Pessoa = new Pessoa();
          const r = result.docs[0];
          p.id = r.get('id');
          p.nome = r.get('nome');
          p.cpf = r.get('cpf');
          p.rg = r.get('rg');
          p.nascimento = r.get('nascimento');
          p.unidade = r.get('unidade');
          p.onibus = r.get('onibus');
          p.status = r.get('status');
          console.log('Encontrado',p)
          resolve(p)
        } else {
          reject('Código não localizado')
        }
      })
    })
  }

  registrarMovimentacao(qrcode: string, veiculo: Veiculo) {
    //Buscar o pessoa pelo codigo

    //Incrementar a parada
    
    //
  }

  private getParadaAtual(veiculo: Veiculo):AngularFirestoreDocument<Parada> {
    return this.store.doc<Parada>('veiculos/${veiculo.id}/paradaAtual');
  }

  criarParada(
    endereco: string,
    inicio: Date,
    idViagem: string,
    idVeiculo: string
  ): Promise<void> {
    const id = this.store.createId();
    const parada = {
      id,
      endereco,
      inicio,
      idVeiculo,
      idViagem,
      ativa: true
    } as Parada;
    this.paradaAtual = parada;
    return this.paradas.doc<Parada>(id).set(parada);
  }

  encerrarParada() {
    this.paradaAtual.ativa = false;
    this.paradaAtual.termino = new Date();
    this.paradas.doc(this.paradaAtual.id).update(this.paradaAtual);
  }

  isEmParada() {
    return this.paradaAtual != undefined ? this.paradaAtual.ativa : false;
  }

  incSaida(pessoaId: string) {
    this.paradaAtual.qtdSaida++;
    this.setQtdSaida(this.paradaAtual.qtdSaida, this.global.Veiculo);
  }

  incEntrada(pessoaId: string) {
    this.paradaAtual.qtdEntrada++;
    this.setQtdEntrada(this.paradaAtual.qtdEntrada, this.global.Veiculo);
  }

  private setQtdEntrada(qtd:number, veiculoId:string) {
    this.paradas.doc('veiculos/${veiculoId}/paradaAtual').update({qtdEntrada: qtd});
  }

  private setQtdSaida(qtd:number, veiculoId:string) {
    this.paradas.doc('veiculos/${veiculoId}/paradaAtual').update({qtdSaida: qtd});
  }

  private setStatusPessoa(pessoaId: string, status: StatusPessoa) {
    this.pessoas.doc(pessoaId).update({status: status})
  }

}
