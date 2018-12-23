import {Table, Column, PrimaryGeneratedColumn} from "ionic-orm";

@Table('pessoa')
export class Pessoa {

    @PrimaryGeneratedColumn({
        
    })
    id: number;

    @Column()
    nome: string;

    @Column()
    cpf: string;

    @Column()
    nascimento: string;

    @Column()
    unidade: string;

    @Column()
    rg: string;

    rg_exp: string;

    @Column()
    status: number;
}