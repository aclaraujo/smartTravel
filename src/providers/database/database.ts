import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  constructor(private sqlite: SQLite) {
    console.log('Hello DatabaseProvider Provider');
  }

  public getDB() {
    return this.sqlite.create({
      name: 'smartTravel.db',
      location: 'default'
    });
  }

  public createDatabase() {
    return this.getDB()
      .then((db: SQLiteObject) => {

        // Criando as tabelas
        this.createTables(db);

        // Inserindo dados padrão
        this.insertDefaultItems(db);

      })
      .catch(e => console.log(e));
  }

  private createTables(db: SQLiteObject) {
    // Criando as tabelas
    db.sqlBatch([
      ['CREATE TABLE IF NOT EXISTS veiculos (id integer primary key AUTOINCREMENT NOT NULL, nome TEXT, placa TEXT)'],
      ['CREATE TABLE IF NOT EXISTS viagens (id integer primary key AUTOINCREMENT NOT NULL, descricao TEXT, veiculo_id integer, partida DATETIME, chegada DATETIME)'],
      ['CREATE TABLE IF NOT EXISTS passageiros (id integer primary key AUTOINCREMENT NOT NULL, nome TEXT, cpf TEXT, unidade TEXT, data_nascimento DATE, rg TEXT, rg_exp TEXT, status INTEGER)'],
      ['CREATE TABLE IF NOT EXISTS paradas (id integer primary key AUTOINCREMENT NOT NULL, inicio DATETIME, termino DATETIME, viagem_id INTEGER, veiculo_id INTEGER, FOREIGN KEY(viagem_id) REFERENCES viagens(id), FOREIGN KEY(veiculo_id) REFERENCES veiculos(id) )'],
      ['CREATE TABLE IF NOT EXISTS historico (id integer primary key AUTOINCREMENT NOT NULL, data DATETIME, acao INTEGER, viagem_id INTEGER, passageiro_id INTEGER, veiculo_id INTEGER, FOREIGN KEY(viagem_id) REFERENCES viagens(id), FOREIGN KEY(passageiro_id) REFERENCES passageiros(id), FOREIGN KEY(veiculo_id) REFERENCES veiculos(id) )']
    ])
      .then(() => console.log('Tabelas criadas'))
      .catch(e => console.error('Erro ao criar as tabelas', e));
  }

  private insertDefaultItems(db: SQLiteObject) {
    db.executeSql('select COUNT(id) as qtd from viagens', [])
      .then((data: any) => {
        //Se não existe nenhum registro
        if (data.rows.item(0).qtd == 0) {

          // Criando as tabelas
          db.sqlBatch([
            ['insert into viagens (descricao,partida,chegada) values (?,?,?)', ['NAT-DSA', new Date(), new Date()]],
            ['insert into viagens (descricao,partida,chegada) values (?,?,?)', ['DSA-NAT', new Date(), new Date()]]
          ])
            .then(() => console.log('Dados padrões incluídos'))
            .catch(e => console.error('Erro ao incluir dados padrões', e));

        }
      })      
    db.executeSql('select COUNT(id) as qtd from veiculos', [])
      .then((data: any) => {
        if (data.rows.item(0).qtd == 0) {
          db.sqlBatch([
            ['insert into veiculos (nome, placa) values (?,?)', ['ONIBUS 1', 'JPQ-0101']],
            ['insert into veiculos (nome, placa) values (?,?)', ['ONIBUS 2', 'JPQ-0102']],
            ['insert into veiculos (nome, placa) values (?,?)', ['ONIBUS 3', 'JPQ-0103']]
          ])
            .then(() => console.log('Dados padrões incluídos'))
            .catch(e => console.error('Erro ao incluir dados padrões', e));
        }
      })
      db.executeSql('select COUNT(id) as qtd from passageiros', [])
      .then((data: any) => {
        if (data.rows.item(0).qtd == 0) {
          db.sqlBatch([
            ['insert into passageiros (nome, data_nascimento, cpf, unidade, rg, rg_exp) values (?,?,?,?,?,?)',
              ['ALBERTO MATHEUS MIRANDA DA SILVA', new Date('18/06/2004'),'71158356404','DELTA', '3684210','SSP/RN']]
          ])
            .then(() => console.log('Dados padrões incluídos'))
            .catch(e => console.error('Erro ao incluir dados padrões', e));
        }
      })      
  }

  public getViagens() {
    return this.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'SELECT v.* FROM viagens v';

        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let viagens: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var viagem = data.rows.item(i);
                viagens.push(viagem);
              }
              return viagens;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getViagem(id: any) {
    return this.getDB().then((db:SQLiteObject) => {
      let sql = 'SELECT v.* FROM viagens v WHERE id = ?';
      return db.executeSql(sql, [id])
        .then((data:any) => {
          return this.getRegistro(data);
        })
    })
  }

  public getVeiculos() {
    return this.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'SELECT v.* FROM veiculos v';

        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let viagens: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var viagem = data.rows.item(i);
                viagens.push(viagem);
              }
              return viagens;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getVeiculo(id: any) {
    return this.getDB().then((db:SQLiteObject) => {
      let sql = 'SELECT v.* FROM veiculos v WHERE id = ?';
      return db.executeSql(sql, [id])
        .then((data:any) => {
          return this.getRegistro(data);
        })
    })
  }

  getLista(data: any) {
    if (data.rows.length > 0) {
      let viagens: any[] = [];
      for (var i = 0; i < data.rows.length; i++) {
        var viagem = data.rows.item(i);
        viagens.push(viagem);
      }
      return viagens;
    } else {
      return [];
    }
  }

  getRegistro(data: any) {
    if (data.rows.length > 0) {      
      var item = data.rows.item(0);      
      return item;
    } else {
      return [];
    }
  }

}
