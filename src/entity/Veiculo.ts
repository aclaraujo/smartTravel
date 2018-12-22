import {Table, Column, PrimaryGeneratedColumn} from "ionic-orm";

@Table()
export class Veiculo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    placa: string;
    
}