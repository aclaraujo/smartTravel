import {Table, Column, PrimaryGeneratedColumn} from "ionic-orm";

@Table()
export class Pessoa {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    cpf: string;

    @Column()
    nascimento: Date;

    @Column()
    unidade: string;

    @Column()
    rg: string;

    @Column()
    rg_exp: string;

    @Column()
    status: number;
}