import { GlobalProvider } from './../../providers/global/global';
import { ORMProvider } from './../../providers/database/orm';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, AlertController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Pessoa } from '../../entity/Pessoa';

/**
 * Generated class for the CapturaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-captura',
  templateUrl: 'captura.html',
})
export class CapturaPage {

  private scanSub: any;
  

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private qrScanner: QRScanner, 
    public viewController: ViewController,
    private toastCtrl: ToastController,
    private orm: ORMProvider,
    private alertCtrl: AlertController,
    private global: GlobalProvider) {
    
  }

  closeModal() {
    this.viewController.dismiss().then(() => {
      this.hideCamera();
    });    
  }

  ionViewWillEnter() {
    this.showCamera();
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted


          // start scanning
          this.scanQR();

          this.qrScanner.show();

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));      
  }

  scanQR() {
    this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
      let dados = text.split(',');
      let cpf = dados[4];      
      this.orm.getPessoaPorCpf(cpf).then(value => {
        let acao = "Registrando SAÍDA de ";
        if (this.global.ListaSaida.has(cpf)) {
          acao = "Registrando ENTRADA de ";
          this.global.ListaSaida.delete(cpf);
          this.global.entrada();
        } else {
          this.global.ListaSaida.set(cpf,value);
          this.global.saida();
        }
        this.presentToast(acao+value.nome);        
      }, reason => {
        this.showAlerta(reason);
      })      
    });
  }

  showAlerta(mensagem:string) {    
    let alert = this.alertCtrl.create({
      title: 'Atenção!',
      subTitle: mensagem,
      buttons: [{
        text: 'Ok',
        handler: () => {
          let _dismmis = alert.dismiss();
          _dismmis.then(()=>{
            this.scanQR();
          });
          return false;
        }
      }]
    });
    alert.present();    
  }

  ionViewWillLeave() {
    this.qrScanner.hide(); // hide camera preview
    this.scanSub.unsubscribe(); // stop scanning
    this.hideCamera();    
  }

  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }

  hideCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }  

  presentToast(text:string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      this.scanQR();
    });

    toast.present();
  }

}
