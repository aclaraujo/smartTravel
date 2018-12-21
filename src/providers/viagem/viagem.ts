import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the ViagemProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ViagemProvider {

  constructor(private dbProvider: DatabaseProvider) {
    console.log('Hello ViagemProvider Provider');
  }

  public getAll() {
    return this.dbProvider.getDB()
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

}
