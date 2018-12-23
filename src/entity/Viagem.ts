import {Table, Column, PrimaryGeneratedColumn} from "ionic-orm";

@Table("viagem")
export class Viagem {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    descricao: string;

    @Column()
    inicio: string;

    @Column()
    termino: string
}