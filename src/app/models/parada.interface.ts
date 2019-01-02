import * as firebase from 'firebase/app';
import { Coordinates } from '@ionic-native/geolocation';

export class Parada {

    id: string;
    endereco: string;
    inicio: Date;
    termino: Date;
    coord: firebase.firestore.GeoPoint;
    ativa: boolean;
    idViagem: string;
    idVeiculo: string;
    qtdEntrada: number = 0;
    qtdSaida: number = 0;
    coordenadas: firebase.firestore.GeoPoint

}