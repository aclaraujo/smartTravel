import {Table, Column, PrimaryGeneratedColumn} from "ionic-orm";

@Table("veiculo")
export class Veiculo {

    @Column()
    id: number;

    @Column()
    nome: string;

    @Column()
    placa: string;
    
}