import * as firebase from 'firebase/app';

export class Parada {

    id: string;
    endereco: string;
    inicio: Date;
    termino: Date;
    coord: firebase.firestore.GeoPoint;
    ativa: boolean;
    idViagem: string;
    idVeiculo: string;
    qtdEntrada: number;
    qtdSaida: number;

}