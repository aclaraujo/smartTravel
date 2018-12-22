import { Pessoa } from './../../entity/Pessoa';
import { Veiculo } from './../../entity/Veiculo';
import { createConnection, getConnection, Connection } from "ionic-orm";
import { Injectable } from "@angular/core";
import { Viagem } from "../../entity/Viagem";

@Injectable()
export class ORMProvider {

    constructor() {
        console.log('Hello ORM Provider');
    }

    conn = getConnection("default");

    repViagem = this.conn.getRepository(Viagem);
    repVeiculo = this.conn.getRepository(Veiculo);
    repPessoa = this.conn.getRepository(Pessoa);

    listViagens() {
        return this.repViagem.findAndCount().then((value: [Viagem[], number]) => {
            return value[0];
        });
    }

    getViagem(id: number) {
        return this.repViagem.findOneById(id).then(value => {
            return value;
        })
    }

    listVeiculos() {
        return this.repVeiculo.findAndCount().then((value: [Veiculo[], number]) => {
            return value[0];
        });
    }

    getVeiculo(id: number) {
        return this.repVeiculo.findOneById(id).then(value => {
            return value;
        })
    }

    getPessoaPorCpf(cpf: string):Promise<Pessoa> {
        return new Promise((resolve, reject) => {            
            this.repPessoa.findOne({cpf: cpf}).then(pessoa => {
                if (pessoa) {
                    console.log("CPF % localizado",cpf);
                    resolve(pessoa);                
                } else {
                    console.log("CPF não localizado");
                    reject("Não localizado");
                }
            });            
        })
        
    }

}