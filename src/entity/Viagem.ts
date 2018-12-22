import {Table, Column, PrimaryGeneratedColumn} from "ionic-orm";

@Table()
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