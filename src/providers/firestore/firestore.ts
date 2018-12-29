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
import { Storage } from '@ionic/storage';

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
    console.log('Convertendo de',doc)
    var v = new Veiculo();
    v.nome = doc.get('nome');
    v.placa = doc.get('placa')
    v.emParada = doc.get('emParada')
    v.id = doc.id;
    const paradaAtual = doc.get('paradaAtual')
    if (paradaAtual) {
      paradaAtual.get().then(obj=>{
        v.paradaAtual = this.toParada(obj);
      })
    }
    console.log('Convertido para veiculo',v)
    return v;
  }

  toViagem(doc) {
    console.log('Convertendo para viagem',doc)
    var v = new Viagem();
    v.descricao = doc.get('descricao');
    v.inicio = doc.get('inicio');
    v.termino = doc.get('termino');
    v.id = doc.id;
    return v;
  }

  toParada(doc):Parada {
    var p = new Parada();
    p = doc.data();
    p.id = doc.id;
    return p;
  }

  toPessoa(doc):Pessoa {
    console.log('Convertendo para pessoa',doc)
    let p = new Pessoa();
    p.nome = doc.get('nome');
    p.nascimento = doc.get('nascimento');
    p.onibus = doc.get('onibus');
    p.qrcode = doc.get('qrcode');
    p.rg = doc.get('rg');
    p.unidade = doc.get('unidade');
    p.status = doc.get('status');
    return p;
  }

  viagens: AngularFirestoreCollection<Viagem>;
  veiculos: AngularFirestoreCollection<Veiculo>;
  paradas: AngularFirestoreCollection<Parada>;
  pessoas: AngularFirestoreCollection<Pessoa>;

  constructor(private db: AngularFirestore,
    private global: GlobalProvider,
    private localStorage: Storage) {
    this.viagens = this.db.collection<Viagem>('viagens');
    this.viagens.get();
    this.veiculos = this.db.collection<Veiculo>('veiculos');
    this.veiculos.get();
    this.paradas = this.db.collection<Parada>('paradas');
    this.paradas.get();
    this.pessoas = this.db.collection<Pessoa>('pessoas');
    this.pessoas.get();
  }

  async listViagens() {
    let viagens = await this.viagens.snapshotChanges()
      .pipe(map(actions => actions.map<Viagem>(this.listDocumentToDomainObject)));
    return viagens;
  }

  async listVeiculos() {
    let veiculos = await this.veiculos.snapshotChanges()
      .pipe(map(actions => actions.map<Veiculo>(doc=>{
        return this.toVeiculo(doc.payload.doc);
      })));
      return veiculos;
  }

  async listPessoas() {
    let pessoas = await this.pessoas.snapshotChanges()
      .pipe(map(actions => actions.map<Pessoa>(doc=>{
        return this.toPessoa(doc.payload.doc);
      })));
      return pessoas;
  }

  listPessoasPorVeiculoStatus(veiculo:string,status:string) {
    return this.db.collection<Pessoa>('pessoas', ref => {
      let query = ref.where('onibus','==',veiculo)
      return query.where('status','==',status);
    }).valueChanges();
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

  /* public getParadaAtual(veiculo: Veiculo): Observable<Parada> {
    return this.db.doc<Parada>(veiculo.paradaAtual).snapshotChanges()
      .pipe(map(doc => {
        return doc.payload;
      })).pipe(map(obj => {
        var parada = obj.data();
        parada.id = obj.id;
        return parada;
      }))
  } */

  async criarParada(
    endereco: string
  ): Promise<Parada> {
    let p = new Parada();
    p.endereco = endereco;
    p.inicio = new Date();
    p.id = this.db.createId();
    p.ativa = true;
    p.idVeiculo = this.global.Veiculo.id;
    p.idViagem = this.global.Viagem.id;
    p.qtdEntrada = 0;
    p.qtdSaida = 0;
    return new Promise<Parada>((resolve, reject) => {
      this.paradas.doc(p.id).set(Object.assign({}, p));
      console.log('Inserindo a parada', p)
      const docRef = this.db.doc(`paradas/${p.id}`).ref;
      console.log('Obtendo a referência', docRef)
      this.db.doc(`veiculos/${this.global.Veiculo.id}`)
        .update({ paradaAtual: docRef, emParada: true }).then(value=>{
          console.log('Veiculo atualizado com as informações da parada',value)
        })
        .catch(erro => {
          console.log(erro)
          reject(erro)
        })
      this.global.Veiculo.paradaAtual = p;
      resolve(p)
    })
  }

  encerrarParada() {
    console.log('Iniciando encerramento da parada')
    const angDoc = this.db.doc<Veiculo>(`veiculos/${this.global.Veiculo.id}`);
    angDoc.get().toPromise().then((result) => {
      const pathParada = result.get('paradaAtual').path;
      console.log('Encerrando a parada do veiculo', result.data)
      this.db.doc(pathParada).update({ termino: new Date(), ativa: false })
      angDoc.update({ paradaAtual: null, emParada: false })
      console.log('Parada encerrada', pathParada)
      this.global.Veiculo.paradaAtual = null;
    }).catch(erro => {
      console.error('Erro encerrando a parada', erro)
    })
  }

  incSaida(pessoaId: string) {
    this.global.Veiculo.paradaAtual.qtdSaida++;
    this.setQtdSaida(this.global.Veiculo.paradaAtual.qtdSaida, this.global.Veiculo.paradaAtual.id);
    this.pessoas.doc(pessoaId).update({status: StatusPessoa.Desembarque})
  }

  incEntrada(pessoaId: string) {
    this.global.Veiculo.paradaAtual.qtdEntrada++;
    this.setQtdEntrada(this.global.Veiculo.paradaAtual.qtdEntrada, this.global.Veiculo.paradaAtual.id);
    this.pessoas.doc(pessoaId).update({status: StatusPessoa.Embarque})
  }

  private setQtdEntrada(qtd: number, id: string) {
    console.log('Ajustando qtdEntrada',qtd)
    this.paradas.doc(id).update({ qtdEntrada: qtd });
  }

  private setQtdSaida(qtd: number, id: string) {
    console.log('Ajustando qtdSaida',qtd)
    this.paradas.doc(id).update({ qtdSaida: qtd });
  }

  private setStatusPessoa(pessoaId: string, status: StatusPessoa) {
    this.pessoas.doc(pessoaId).update({ status: status })
  }

  public load() {
    return new Promise((resolve, reject)=>{
      this.carregaVeiculo().then(()=>{
        this.carregaViagem().then(()=>{
          resolve(true)
        })
      });
    })
  }

  private carregaVeiculo() {
    return this.localStorage.get('veiculoId').then((veiculoId:string)=>{
      console.log('Obtendo veiculo do store local',veiculoId)
      if (veiculoId){
        return this.getVeiculo(veiculoId).then(veiculo=>{
          this.global.Veiculo = veiculo;
          console.log('Obtendo veiculo do firebase',veiculo)
        });
      }
    });
  }

  private carregaViagem() {
    return this.localStorage.get('viagemId').then((viagemId:string)=>{
      console.log('Obtendo viagem do store local',viagemId)
      if (viagemId) {
        return this.getViagem(viagemId).then(viagem=>{
          this.global.Viagem = viagem;
          console.log('Obtendo viagem do firebase',viagem)
        })
      }
    })
  }

}
