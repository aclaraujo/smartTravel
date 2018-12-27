import { firestore } from 'firebase';
import { GlobalProvider } from './../global/global';

import { Veiculo } from './../../app/models/veiculo.interface';
import { Pessoa, StatusPessoa } from './../../app/models/pessoa.interface';
import { Parada } from './../../app/models/parada.interface';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { map } from 'rxjs/operators/map';
import { Viagem } from '../../app/models/viagem.interface';
import { Observable } from 'rxjs/Observable';

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

  toVeiculo(doc) {
    var v = new Veiculo();
    v = doc.data();
    v.id = doc.id;
    const paradaAtual = doc.get('paradaAtual')
    v.paradaAtual = paradaAtual ? paradaAtual.path : '';
    return v;
  }

  toViagem(doc) {
    console.log('Convertendo para viagem',doc)
    var v = new Viagem();
    v = doc.data();
    v.id = doc.id;
    return v;
  }

  toParada(doc) {
    var p = new Parada();
    p = doc.data();
    p.id = doc.id;
    return p;
  }

  toPessoa(obj: any) {
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

  constructor(private db: AngularFirestore,
    private global: GlobalProvider) {
    this.viagens = this.db.collection<Viagem>('viagens');
    this.veiculos = this.db.collection<Veiculo>('veiculos');
    this.paradas = this.db.collection<Parada>('paradas');
    this.pessoas = this.db.collection<Pessoa>('pessoas');
  }

  listViagens() {
    let viagens = this.viagens.snapshotChanges()
      .pipe(map(actions => actions.map<Viagem>(this.listDocumentToDomainObject)));
    return viagens;
  }

  listVeiculos() {
    let veiculos = this.veiculos.snapshotChanges()
      .pipe(map(actions => actions.map<Veiculo>(doc=>{
        return this.toVeiculo(doc.payload.doc);
      })));
      return veiculos;
  }

  getViagem(id: string) {
    return this.viagens.doc(id).ref.get().then(doc=>{
      return this.toViagem(doc)
    })
  }

  getVeiculo(id: string) {
    return this.veiculos.doc(id).ref.get().then(doc=>{
      return this.toVeiculo(doc)
    })
  }

  getParada(path: string) {
    return this.db.doc(path).ref.get().then(doc=>{
      return this.toParada(doc)
    })
  }

  findPessoaByQRCode(qrcode: string): Promise<Pessoa> {
    //localiza a pessoa pelo qrcode
    console.log('Buscando', qrcode)
    return new Promise<Pessoa>((resolve, reject) => {
      this.pessoas.ref.where('qrcode', '==', qrcode).get().then((result) => {
        if (result.size > 0) {
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
          console.log('Encontrado', p)
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

  public getParadaAtual(veiculo: Veiculo): Observable<Parada> {
    return this.db.doc<Parada>(veiculo.paradaAtual).snapshotChanges()
      .pipe(map(doc => {
        return doc.payload;
      })).pipe(map(obj => {
        var parada = obj.data();
        parada.id = obj.id;
        return parada;
      }))
  }

  criarParada(
    endereco: string
  ): Promise<Parada> {
    let p = new Parada();
    p.endereco = endereco;
    p.inicio = new Date();
    p.id = this.db.createId();
    p.ativa = true;
    p.idVeiculo = this.global.Veiculo.id;
    p.idViagem = this.global.Viagem.id;
    this.global.Parada = p;
    return new Promise<Parada>((resolve, reject) => {
      this.paradas.doc(p.id).set(Object.assign({}, p));
      console.log('Inserindo a parada', p)
      const docRef = this.db.doc(`paradas/${p.id}`).ref;
      console.log('Obtendo a referência', docRef)
      this.db.doc(`veiculos/${this.global.Veiculo.id}`)
        .update({ paradaAtual: docRef, emParada: true }).catch(erro => {
          console.log(erro)
          reject(erro)
        })
      resolve(p)
    })
  }

  encerrarParada() {
    console.log('Iniciando encerramento da parada')
    const angDoc = this.db.doc<Veiculo>(`veiculos/${this.global.Veiculo.id}`);
    angDoc.get().toPromise().then((result) => {
      const pathParada = result.get('paradaAtual');
      console.log('Encerrando a parada do veiculo', result.data)
      this.db.doc(pathParada).update({ termino: new Date(), ativa: false })
      angDoc.update({ paradaAtual: "", emParada: false })
      console.log('Parada encerrada', pathParada)
      this.global.Parada = null;
    }).catch(erro => {
      console.error('Erro encerrando a parada', erro)
    })
  }

  isEmParada(): boolean {
    return this.global.Parada ? this.global.Parada.ativa : false;
  }

  incSaida(pessoaId: string) {
    this.global.Parada.qtdSaida++;
    this.setQtdSaida(this.global.Parada.qtdSaida, this.global.Parada.id);
  }

  incEntrada(pessoaId: string) {
    this.global.Parada.qtdEntrada++;
    this.setQtdEntrada(this.global.Parada.qtdEntrada, this.global.Parada.id);
  }

  private setQtdEntrada(qtd: number, id: string) {
    this.paradas.doc(id).update({ qtdEntrada: qtd });
  }

  private setQtdSaida(qtd: number, id: string) {
    this.paradas.doc(id).update({ qtdSaida: qtd });
  }

  private setStatusPessoa(pessoaId: string, status: StatusPessoa) {
    this.pessoas.doc(pessoaId).update({ status: status })
  }

}
