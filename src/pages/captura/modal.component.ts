import { StatusPessoa } from './../../app/models/pessoa.interface';
import { ViewController, NavParams } from 'ionic-angular';
import { Component } from "@angular/core";

@Component({
    selector: '.modal-component',
    templateUrl: 'modal.html'
  })
  export class ModalComponent {

    public passageiro;
    public embarque:boolean = false;
    public desembarque: boolean = false;

    constructor(private viewCtrl: ViewController,
        private params:NavParams) {
            
        this.passageiro = params.get('passageiro')
        
        this.embarque = this.passageiro.status == StatusPessoa.Embarque;
        this.desembarque = this.passageiro.status == StatusPessoa.Desembarque;
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
  }