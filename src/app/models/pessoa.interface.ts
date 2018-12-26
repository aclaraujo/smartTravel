export enum StatusPessoa {
    Embarque = 1,
    Desembarque = 2,
    Ausente = 0
}

export class Pessoa {

    id: string;
    nome: string;
    cpf: string;
    nascimento: Date;
    rg: string;
    onibus: string;
    unidade: string;
    qrcode: string;
    status: StatusPessoa;

}