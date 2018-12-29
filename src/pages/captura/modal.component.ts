import { ViewController, NavParams } from 'ionic-angular';
import { Component } from "@angular/core";

@Component({
    selector: '.modal-component',
    templateUrl: 'modal.html'
  })
  export class ModalComponent {

    public passageiro: string;

    constructor(private viewCtrl: ViewController,
        private params:NavParams) {
            
        this.passageiro = params.get('passageiro')

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
  }