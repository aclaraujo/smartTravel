import { Parada } from './parada.interface';
export class Veiculo {

    id: string;
    nome: string;
    placa: string;
    emParada: boolean;
    paradaAtual: Parada;

}