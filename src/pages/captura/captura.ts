import { FirestoreProvider } from './../../providers/firestore/firestore';
import { GlobalProvider } from './../../providers/global/global';
import { Component, ɵConsole } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, AlertController, ModalController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Pessoa, StatusPessoa } from "../../app/models/pessoa.interface";
import { ModalComponent } from './modal.component';

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

  public opcao: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private qrScanner: QRScanner,
    public viewController: ViewController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public global: GlobalProvider,
    private fireStore: FirestoreProvider,
    private modalCtrl: ModalController, ) {

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
      const nome = text.split(';')[0]
      console.log("qrcode",text)

      this.fireStore.findPessoaByNome(nome).then(pessoa => {

        if (pessoa.onibus == this.global.Veiculo.id) {

          if (this.opcao == Opcao.Embarque) {
            if (pessoa.status == StatusPessoa.Ausente || pessoa.status == StatusPessoa.Desembarque) {
              this.fireStore.incEntrada(pessoa.id);
              pessoa.status = StatusPessoa.Embarque;
              this.showToast(pessoa);
            } else {
              this.showAlerta(`EMBARQUE já realizado.`);
            }
          } else if (this.opcao == Opcao.Desembarque) {
            if (pessoa.status == StatusPessoa.Ausente || pessoa.status == StatusPessoa.Embarque) {
              this.fireStore.incSaida(pessoa.id);
              pessoa.status = StatusPessoa.Desembarque;
              this.showToast(pessoa);
            } else {
              this.showAlerta(`DESEMBARQUE já realizado.`);
            }
          }
          else {
            this.showAlerta('Escolha uma opção. (EMBARQUE/DESEMBARQUE')
          }
        }
        else {
          this.showAlerta(`O embarque/desembarque deve ser feito no ônibus <h3>${pessoa.onibus}</h3>`);
        }
      }, reason => {
        this.showAlerta(reason);
      })
    });
  }

  showToast(pessoa: Pessoa) {
    let modal = this.modalCtrl.create(ModalComponent, { passageiro: pessoa })
      modal.present();

    modal.onDidDismiss(()=>{
      this.scanQR();
    })

    setTimeout (()=>{
      modal.dismiss();
    },3000);
    
  }

  showToastSaida(pessoa: Pessoa) {

  }

  showAlerta(mensagem: string) {
    let alert = this.alertCtrl.create({
      title: 'Atenção!',
      subTitle: mensagem,
      buttons: [{
        text: 'Ok',
        handler: () => {
          let _dismmis = alert.dismiss();
          _dismmis.then(() => {
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

  presentToast(opcao:string, p: Pessoa) {
    let toast = this.toastCtrl.create({
      message: `${opcao} registrado para: \n${p.nome} \nUnidade: ${p.unidade}`,
      duration: 3000,
      position: 'middle',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      this.scanQR();
    });

    toast.present();
  }

}

export enum Opcao {
  Embarque = 0,
  Desembarque = 1
}
