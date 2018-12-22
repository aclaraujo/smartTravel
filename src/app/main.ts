import { Pessoa } from './../entity/Pessoa';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

import "reflect-metadata";
import {createConnection, getConnection} from "ionic-orm";
import {Viagem} from "../entity/Viagem";
import {Veiculo} from '../entity/Veiculo';

platformBrowserDynamic().bootstrapModule(AppModule); 

createConnection({
    driver: {
        type: "websql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "admin",
        database: "test"
    },
    entities: [
        Viagem,
        Veiculo,
        Pessoa
    ],
    autoSchemaSync: true,
}).then(connection => {

    let repViagem = connection.getRepository(Viagem);
    let repVeiculo = connection.getRepository(Veiculo);
    let repPessoa = connection.getRepository(Pessoa);

    repViagem.findAndCount().then((value:[Viagem[], number]) => {
        if (value[1]==0) {

            let viagem = new Viagem();
            viagem.descricao = "NAT-DAS";
            viagem.inicio = "03/01/2019";
            viagem.termino = "17/01/2019";

            connection.getRepository(Viagem).persist(viagem).then(viagem => {
                console.log("Viagem salva com o id ", viagem.id);
            })

            viagem = new Viagem();
            viagem.descricao = "DAS-NAT";
            viagem.inicio = "03/01/2019";
            viagem.termino = "17/01/2019";

            connection.getRepository(Viagem).persist(viagem).then(viagem => {
                console.log("Viagem salva com o id ", viagem.id);
            })            

        }
            
    })

    repVeiculo.findAndCount().then((value:[Veiculo[], number]) => {
        if (value[1]==0) {
            
            let veiculo = new Veiculo();
            veiculo.nome = "ONIBUS 1";
            veiculo.placa = "PZL-3465";

            repVeiculo.persist(veiculo).then(veiculo => {
                console.log("Veiculo salva com o id ", veiculo.id);
            })

            veiculo = new Veiculo();
            veiculo.nome = "ONIBUS 2";
            veiculo.placa = "PZL-3465";

            repVeiculo.persist(veiculo).then(veiculo => {
                console.log("Veiculo salva com o id ", veiculo.id);
            })

            veiculo = new Veiculo();
            veiculo.nome = "ONIBUS 3";
            veiculo.placa = "PZL-3465";

            repVeiculo.persist(veiculo).then(veiculo => {
                console.log("Veiculo salva com o id ", veiculo.id);
            })
        }
    })

    repPessoa.findAndCount().then((value:[Pessoa[],number]) => {
        if (value[1]==0) {
            let pessoa = new Pessoa();
            pessoa.nome = "ALBERTO MATHEUS MIRANDA DA SILVA";
            pessoa.cpf = "71158356404";
            pessoa.nascimento = new Date("18/06/2004");
            pessoa.rg = "3684210";
            pessoa.rg_exp = "SSP/RN";
            pessoa.status = 0;
            pessoa.unidade = "BETA";

            repPessoa.persist(pessoa).then(pessoa => {
                console.log("Pessoa salva com o id ", pessoa.id);
            })
        }
    })

    

    console.log("Banco ceiado com sucesso")
});

